import { Hono } from 'hono';
import { InvoiceStatus } from '@prisma/client';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const invoices = new Hono<{ Bindings: Env; Variables: Variables }>();

// Get all invoices for a client
invoices.get('/invoices/client/:clientId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { clientId } = c.req.param();

    const invoicesList = await prisma.invoice.findMany({
      where: {
        booking: {
          clientId: parseInt(clientId)
        }
      },
      include: {
        booking: {
          include: {
            contractor: true,
            service: true
          }
        },
        payments: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform to match UI format
    const transformedInvoices = invoicesList.map(invoice => ({
      id: invoice.id,
      invoiceNumber: `INV-${invoice.id.toString().padStart(6, '0')}`,
      service: invoice.booking.service.name,
      provider: invoice.booking.contractor.name,
      providerId: invoice.booking.contractor.id,
      date: invoice.booking.scheduledDate.toISOString().split('T')[0],
      dueDate: invoice.dueDate?.toISOString().split('T')[0] || null,
      amount: invoice.amount,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      status: invoice.status === InvoiceStatus.PAID ? 'paid' : 'unpaid',
      description: `${invoice.booking.service.name} service`,
      paidDate: invoice.paidAt?.toISOString().split('T')[0] || null,
      bookingId: invoice.bookingId
    }));

    return c.json({
      success: true,
      invoices: transformedInvoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch invoices'
    }, 500);
  }
});

// Get all invoices for a contractor
invoices.get('/invoices/contractor/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();

    const invoicesList = await prisma.invoice.findMany({
      where: {
        booking: {
          contractorId: parseInt(contractorId)
        }
      },
      include: {
        booking: {
          include: {
            client: true,
            service: true
          }
        },
        payments: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform to match UI format
    const transformedInvoices = invoicesList.map(invoice => ({
      id: invoice.id,
      invoiceNumber: `INV-${invoice.id.toString().padStart(6, '0')}`,
      service: invoice.booking.service.name,
      client: `${invoice.booking.client.firstName} ${invoice.booking.client.lastName}`,
      clientId: invoice.booking.client.id,
      date: invoice.booking.scheduledDate.toISOString().split('T')[0],
      dueDate: invoice.dueDate?.toISOString().split('T')[0] || null,
      amount: invoice.amount,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      status: invoice.status === InvoiceStatus.PAID ? 'paid' : 'unpaid',
      description: `${invoice.booking.service.name} service`,
      paidDate: invoice.paidAt?.toISOString().split('T')[0] || null,
      bookingId: invoice.bookingId
    }));

    return c.json({
      success: true,
      invoices: transformedInvoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch invoices'
    }, 500);
  }
});

// Get a single invoice
invoices.get('/invoices/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
      include: {
        booking: {
          include: {
            contractor: true,
            client: true,
            service: true
          }
        },
        payments: true
      }
    });

    if (!invoice) {
      return c.json({
        success: false,
        error: 'Invoice not found'
      }, 404);
    }

    return c.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch invoice'
    }, 500);
  }
});

// Create an invoice
invoices.post('/invoices', async (c) => {
  try {
    const prisma = c.get('prisma');
    const {
      bookingId,
      amount,
      taxAmount,
      dueDate
    } = await c.req.json();

    if (!bookingId || !amount) {
      return c.json({
        success: false,
        error: 'bookingId and amount are required'
      }, 400);
    }

    const totalAmount = amount + (taxAmount || 0);

    const invoice = await prisma.invoice.create({
      data: {
        bookingId: parseInt(bookingId),
        amount,
        taxAmount: taxAmount || null,
        totalAmount,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: InvoiceStatus.PENDING
      },
      include: {
        booking: {
          include: {
            contractor: true,
            client: true,
            service: true
          }
        }
      }
    });

    return c.json({
      success: true,
      invoice,
      message: 'Invoice created successfully'
    }, 201);
  } catch (error) {
    console.error('Error creating invoice:', error);
    return c.json({
      success: false,
      error: 'Failed to create invoice'
    }, 500);
  }
});

// Update invoice status
invoices.patch('/invoices/:id/status', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { status } = await c.req.json();

    if (!status || !Object.values(InvoiceStatus).includes(status)) {
      return c.json({
        success: false,
        error: 'Valid status is required (PENDING, PAID, OVERDUE, CANCELLED)'
      }, 400);
    }

    const updateData: any = { status };

    // If marking as paid, set paidAt
    if (status === InvoiceStatus.PAID) {
      updateData.paidAt = new Date();
    }

    const invoice = await prisma.invoice.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        booking: true
      }
    });

    // Update booking payment status if invoice is paid
    if (status === InvoiceStatus.PAID) {
      await prisma.booking.update({
        where: { id: invoice.bookingId },
        data: { paymentReceived: true }
      });
    }

    return c.json({
      success: true,
      invoice,
      message: 'Invoice status updated successfully'
    });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    return c.json({
      success: false,
      error: 'Failed to update invoice status'
    }, 500);
  }
});

// Delete an invoice
invoices.delete('/invoices/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    await prisma.invoice.delete({
      where: { id: parseInt(id) }
    });

    return c.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return c.json({
      success: false,
      error: 'Failed to delete invoice'
    }, 500);
  }
});

export default invoices;
