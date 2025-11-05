import { Hono } from 'hono';
import { MessageStatus, SenderType, FlaggedByType, FlagStatus } from '@prisma/client';
import type { Env } from '../worker';
import type { PrismaClient } from '@prisma/client/edge';

type Variables = {
  prisma: PrismaClient;
};

const messages = new Hono<{ Bindings: Env; Variables: Variables }>();

// POST /api/messages - Create a new conversation/message thread
messages.post('/messages', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId, clientId, subject } = await c.req.json();

    if (!contractorId || !clientId) {
      return c.json({
        success: false,
        error: 'Contractor ID and client ID are required'
      }, 400);
    }

    // Check if conversation already exists
    const existingMessage = await prisma.message.findFirst({
      where: {
        contractorId,
        clientId
      }
    });

    if (existingMessage) {
      return c.json({
        success: true,
        message: existingMessage,
        isNew: false
      });
    }

    // Create new conversation
    const message = await prisma.message.create({
      data: {
        contractorId,
        clientId,
        subject: subject || 'New Conversation',
        status: MessageStatus.UNREAD
      },
      include: {
        contractor: {
          select: {
            id: true,
            name: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return c.json({
      success: true,
      message,
      isNew: true
    }, 201);
  } catch (error) {
    console.error('Create message error:', error);
    return c.json({
      success: false,
      error: 'Failed to create message'
    }, 500);
  }
});

// GET /api/messages/contractor/:contractorId - Get all conversations for a contractor
messages.get('/messages/contractor/:contractorId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { contractorId } = c.req.param();

    const messagesList = await prisma.message.findMany({
      where: {
        contractorId: parseInt(contractorId)
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        },
        chatMessages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return c.json({
      success: true,
      messages: messagesList,
      count: messagesList.length
    });
  } catch (error) {
    console.error('Get contractor messages error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch messages'
    }, 500);
  }
});

// GET /api/messages/client/:clientId - Get all conversations for a client
messages.get('/messages/client/:clientId', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { clientId } = c.req.param();

    const messagesList = await prisma.message.findMany({
      where: {
        clientId: parseInt(clientId)
      },
      include: {
        contractor: {
          select: {
            id: true,
            name: true,
            phone: true,
            rating: true
          }
        },
        chatMessages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return c.json({
      success: true,
      messages: messagesList,
      count: messagesList.length
    });
  } catch (error) {
    console.error('Get client messages error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch messages'
    }, 500);
  }
});

// GET /api/messages/:id - Get conversation details with all chat messages
messages.get('/messages/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    const message = await prisma.message.findUnique({
      where: { id: parseInt(id) },
      include: {
        contractor: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        },
        chatMessages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!message) {
      return c.json({
        success: false,
        error: 'Conversation not found'
      }, 404);
    }

    return c.json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Get message error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch message'
    }, 500);
  }
});

// POST /api/messages/:id/chat - Send a chat message in a conversation
messages.post('/messages/:id/chat', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { sender, messageText } = await c.req.json();

    if (!sender || !messageText) {
      return c.json({
        success: false,
        error: 'Sender and message text are required'
      }, 400);
    }

    if (!['CONTRACTOR', 'CLIENT'].includes(sender)) {
      return c.json({
        success: false,
        error: 'Sender must be CONTRACTOR or CLIENT'
      }, 400);
    }

    // Verify conversation exists
    const conversation = await prisma.message.findUnique({
      where: { id: parseInt(id) }
    });

    if (!conversation) {
      return c.json({
        success: false,
        error: 'Conversation not found'
      }, 404);
    }

    // Create chat message and update conversation status
    const chatMessage = await prisma.chatMessage.create({
      data: {
        messageId: parseInt(id),
        sender: sender as SenderType,
        messageText
      }
    });

    // Update conversation timestamp and status
    await prisma.message.update({
      where: { id: parseInt(id) },
      data: {
        status: MessageStatus.UNREAD,
        updatedAt: new Date()
      }
    });

    return c.json({
      success: true,
      chatMessage,
      message: 'Message sent successfully'
    }, 201);
  } catch (error) {
    console.error('Send chat message error:', error);
    return c.json({
      success: false,
      error: 'Failed to send message'
    }, 500);
  }
});

// PATCH /api/messages/:id/read - Mark conversation as read
messages.patch('/messages/:id/read', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();

    const message = await prisma.message.update({
      where: { id: parseInt(id) },
      data: { status: MessageStatus.READ }
    });

    return c.json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    return c.json({
      success: false,
      error: 'Failed to mark as read'
    }, 500);
  }
});

// POST /api/flag-message - Flag a message for admin review
messages.post('/flag-message', async (c) => {
  try {
    const prisma = c.get('prisma');
    const {
      messageId,
      messageText,
      flaggedBy,
      flaggedById,
      contractorId,
      clientId,
      reason,
      details
    } = await c.req.json();

    if (!messageText || !flaggedBy || !flaggedById || !reason) {
      return c.json({
        success: false,
        error: 'Message text, flagged by info, and reason are required'
      }, 400);
    }

    if (!['CONTRACTOR', 'CLIENT'].includes(flaggedBy)) {
      return c.json({
        success: false,
        error: 'Flagged by must be CONTRACTOR or CLIENT'
      }, 400);
    }

    const flaggedMessage = await prisma.flaggedMessage.create({
      data: {
        messageId: messageId || null,
        messageText,
        flaggedBy: flaggedBy as FlaggedByType,
        flaggedById,
        contractorId: contractorId || null,
        clientId: clientId || null,
        reason,
        details: details || null,
        status: FlagStatus.PENDING
      }
    });

    return c.json({
      success: true,
      flaggedMessage,
      message: 'Message flagged successfully'
    }, 201);
  } catch (error) {
    console.error('Flag message error:', error);
    return c.json({
      success: false,
      error: 'Failed to flag message'
    }, 500);
  }
});

// GET /api/flagged-messages - Get all flagged messages (admin)
messages.get('/flagged-messages', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { status } = c.req.query();

    const where: any = {};
    if (status) {
      where.status = status as FlagStatus;
    }

    const flaggedMessages = await prisma.flaggedMessage.findMany({
      where,
      include: {
        contractor: {
          select: {
            id: true,
            name: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return c.json({
      success: true,
      flaggedMessages,
      count: flaggedMessages.length
    });
  } catch (error) {
    console.error('Get flagged messages error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch flagged messages'
    }, 500);
  }
});

// PATCH /api/flagged-messages/:id/status - Update flagged message status (admin)
messages.patch('/flagged-messages/:id/status', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { id } = c.req.param();
    const { status, reviewedBy, adminNote } = await c.req.json();

    if (!status || !Object.values(FlagStatus).includes(status)) {
      return c.json({
        success: false,
        error: 'Valid status is required'
      }, 400);
    }

    // Get the flagged message details before updating
    const existingFlag = await prisma.flaggedMessage.findUnique({
      where: { id: parseInt(id) },
      include: {
        client: true,
        contractor: true
      }
    });

    const flaggedMessage = await prisma.flaggedMessage.update({
      where: { id: parseInt(id) },
      data: {
        status,
        reviewedBy: reviewedBy || null,
        reviewedAt: new Date(),
        details: adminNote ? `${adminNote}` : undefined
      }
    });

    // Log the flag status change if it's being dismissed
    if (status === 'DISMISSED' && existingFlag) {
      await prisma.activityLog.create({
        data: {
          userId: reviewedBy || 1,
          action: 'Flag Dismissed',
          details: `Dismissed flag #${id}. Message from ${existingFlag.flaggedBy.toLowerCase()}. Reason: ${existingFlag.reason}. ${adminNote || 'No additional notes.'}`,
          severity: 'LOW',
          metadata: {
            flagId: parseInt(id),
            flagReason: existingFlag.reason,
            flaggedBy: existingFlag.flaggedBy
          }
        }
      });
    }

    return c.json({
      success: true,
      flaggedMessage,
      message: 'Flagged message status updated'
    });
  } catch (error) {
    console.error('Update flagged message error:', error);
    return c.json({
      success: false,
      error: 'Failed to update flagged message'
    }, 500);
  }
});

// POST /api/admin/user-action - Perform admin action on user (warn/suspend/ban)
messages.post('/admin/user-action', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { userId, userType, action, reason, adminNote, flagId } = await c.req.json();

    if (!userId || !userType || !action) {
      return c.json({
        success: false,
        error: 'userId, userType, and action are required'
      }, 400);
    }

    // Validate action
    const validActions = ['WARN', 'SUSPEND', 'BAN'];
    if (!validActions.includes(action)) {
      return c.json({
        success: false,
        error: 'Invalid action. Must be WARN, SUSPEND, or BAN'
      }, 400);
    }

    // Update user based on action
    let updateData: any = {};

    if (action === 'WARN') {
      // For warnings, we could add a warnings count or log it
      // For now, we'll just log the action (could be enhanced with a warnings table)
      console.log(`WARNING issued to ${userType} ${userId}: ${reason}`);
      // You could create a separate warnings table or add a warnings field to user tables
    } else if (action === 'SUSPEND') {
      // Suspend for 7 days
      const suspendUntil = new Date();
      suspendUntil.setDate(suspendUntil.getDate() + 7);
      updateData.suspendedUntil = suspendUntil;
      updateData.isActive = false;
    } else if (action === 'BAN') {
      // Permanent ban
      updateData.isActive = false;
      updateData.isBanned = true;
    }

    // Update the appropriate user table
    let updatedUser;
    if (userType === 'CLIENT') {
      updatedUser = await prisma.client.update({
        where: { id: userId },
        data: updateData
      });
    } else if (userType === 'CONTRACTOR') {
      updatedUser = await prisma.contractor.update({
        where: { id: userId },
        data: updateData
      });
    } else {
      return c.json({
        success: false,
        error: 'Invalid userType. Must be CLIENT or CONTRACTOR'
      }, 400);
    }

    // TODO: Send notification to user about the action taken
    // This could be an email, in-app notification, etc.

    // Log the admin action
    const userName = userType === 'CLIENT'
      ? `${(updatedUser as any).firstName} ${(updatedUser as any).lastName}`
      : (updatedUser as any).name;

    await prisma.activityLog.create({
      data: {
        userId: 1, // TODO: Replace with actual admin user ID from session
        action: `User ${action}`,
        details: `${action} ${userType.toLowerCase()} "${userName}" (ID: ${userId}). Reason: ${reason || 'N/A'}. ${adminNote || ''}`,
        severity: action === 'BAN' ? 'HIGH' : action === 'SUSPEND' ? 'MEDIUM' : 'LOW',
        metadata: {
          actionType: action,
          targetUserId: userId,
          targetUserType: userType,
          flagId: flagId || null,
          reason: reason || null
        }
      }
    });

    return c.json({
      success: true,
      message: `User ${action.toLowerCase()}ed successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Admin user action error:', error);
    return c.json({
      success: false,
      error: 'Failed to perform admin action'
    }, 500);
  }
});

// POST /api/admin/delete-message - Delete a flagged message
messages.post('/admin/delete-message', async (c) => {
  try {
    const { flagId, messageId, adminNote } = await c.req.json();

    if (!flagId) {
      return c.json({
        success: false,
        error: 'flagId is required'
      }, 400);
    }

    // If there's a messageId, we could mark the message as deleted
    // For now, we'll just update the flag to indicate the message was handled
    // In a real implementation, you might want to soft-delete the message from the messages table

    if (messageId) {
      // TODO: Implement message deletion/soft-delete in your messages table
      // await prisma.message.update({
      //   where: { id: messageId },
      //   data: { isDeleted: true, deletedAt: new Date() }
      // });
      console.log(`Message ${messageId} marked for deletion by admin`);
    }

    return c.json({
      success: true,
      message: 'Message deletion processed'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    return c.json({
      success: false,
      error: 'Failed to delete message'
    }, 500);
  }
});

export default messages;
