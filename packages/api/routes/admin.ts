import { Router } from 'express';
import { prisma } from '@lib/prisma';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// GET /api/admin/dashboard - Get admin dashboard data
router.get('/dashboard', authenticate, authorize(['admin']), async (req, res) => {
  try {
    // Get total counts for dashboard
    const [
      totalUsers,
      totalClubs,
      totalEvents,
      pendingEvents
    ] = await Promise.all([
      prisma.user.count(),
      prisma.club.count(),
      prisma.event.count(),
      prisma.event.count({
        where: { approved: false }
      })
    ]);

    res.json({
      stats: {
        totalUsers,
        totalClubs,
        totalEvents,
        pendingEvents
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET /api/admin/users - Get all users with their roles
router.get('/users', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/admin/events - Get all events with approval status
router.get('/events', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        club: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(events);
  } catch (error) {
    console.error('Admin events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// PATCH /api/admin/events/{eventId}/approve - Approve an event
router.patch('/events/:eventId/approve', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { eventId } = req.params;
    const { approved } = req.body;

    if (typeof approved !== 'boolean') {
      return res.status(400).json({ error: 'Invalid approval status' });
    }

    const event = await prisma.event.update({
      where: { id: eventId },
      data: { approved },
      include: {
        club: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(event);
  } catch (error) {
    console.error('Admin event approval error:', error);
    res.status(500).json({ error: 'Failed to update event approval status' });
  }
});

export default router;