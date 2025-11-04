import express from 'express';
import { prisma } from '../lib/prisma';
import { InvoiceStatus } from '@prisma/client';

const router = express.Router();

// Get all invoices for a client
router.get('/invoices/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    const invoices = await prisma.invoice.findMany({
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
    const transformedInvoices = invoices.map(invoice => ({
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

    return res.json({
      success: true,
      invoices: transformedInvoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch invoices'
    });
  }
});

// Get all invoices for a contractor
router.get('/invoices/contractor/:contractorId', async (req, res) => {
  try {
    const { contractorId } = req.params;

    const invoices = await prisma.invoice.findMany({
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
    const transformedInvoices = invoices.map(invoice => ({
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

    return res.json({
      success: true,
      invoices: transformedInvoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch invoices'
    });
  }
});

// Get a single invoice
router.get('/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;

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
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }

    return res.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch invoice'
    });
  }
});

// Create an invoice
router.post('/invoices', async (req, res) => {
  try {
    const {
      bookingId,
      amount,
      taxAmount,
      dueDate
    } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'bookingId and amount are required'
      });
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

    return res.status(201).json({
      success: true,
      invoice,
      message: 'Invoice created successfully'
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create invoice'
    });
  }
});

// Update invoice status
router.patch('/invoices/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(InvoiceStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status is required (PENDING, PAID, OVERDUE, CANCELLED)'
      });
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

    return res.json({
      success: true,
      invoice,
      message: 'Invoice status updated successfully'
    });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update invoice status'
    });
  }
});

// Delete an invoice
router.delete('/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.invoice.delete({
      where: { id: parseInt(id) }
    });

    return res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete invoice'
    });
  }
});

export default router;
