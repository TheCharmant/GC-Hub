import { Router } from 'express';
import { prisma } from '@lib/prisma';

const router = Router();

// GET /api/admin/dashboard — System-wide overview
router.get('/dashboard', async (_req, res) => {
  try {
    // In production, verify user is admin
    
    // Get counts
    const userCount = await prisma.user.count();
    const clubCount = await prisma.club.count();
    const eventCount = await prisma.event.count();
    const registrationCount = await prisma.eventRegistration.count();
    
    // Get recent events
    const recentEvents = await prisma.event.findMany({
      orderBy: {
        date: 'desc'
      },
      take: 5,
      include: {
        club: true,
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // Get user distribution by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });
    
    res.json({
      counts: {
        users: userCount,
        clubs: clubCount,
        events: eventCount,
        registrations: registrationCount
      },
      recentEvents,
      usersByRole: usersByRole.map(item => ({
        role: item.role,
        count: item._count.role
      }))
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch admin dashboard' });
  }
});

// GET /api/admin/users — List all users
router.get('/users', async (_req, res) => {
  try {
    // In production, verify user is admin
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/admin/events — List all events
router.get('/events', async (_req, res) => {
  try {
    // In production, verify user is admin
    
    const events = await prisma.event.findMany({
      include: {
        club: true,
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// PATCH /api/admin/events/:id/approve — Approve/publish event
router.patch('/events/:id/approve', async (req, res) => {
  try {
    const { approved } = req.body;
    
    // In production, verify user is admin
    
    const updatedEvent = await prisma.event.update({
      where: { id: req.params.id },
      data: { approved }
    });
    
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error approving event:', error);
    res.status(500).json({ error: 'Failed to approve event' });
  }
});

export default router;