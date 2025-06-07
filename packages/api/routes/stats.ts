import { Router } from 'express';
import { prisma } from '@lib/prisma';

const router = Router();

// GET /api/stats/user/:userId — Stats for a student
router.get('/user/:userId', async (req, res) => {
  try {
    // Get user stats
    const stats = await prisma.stat.findUnique({
      where: { userId: req.params.userId }
    });
    
    if (!stats) {
      return res.json({
        userId: req.params.userId,
        totalEvents: 0,
        totalHours: 0
      });
    }
    
    // Get recent events
    const recentEvents = await prisma.eventRegistration.findMany({
      where: {
        userId: req.params.userId,
        attended: true
      },
      include: {
        event: true
      },
      orderBy: {
        registeredAt: 'desc'
      },
      take: 5
    });
    
    res.json({
      ...stats,
      recentEvents
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// GET /api/stats/club/:clubId — Club-level participation stats
router.get('/club/:clubId', async (req, res) => {
  try {
    // Get events by this club
    const events = await prisma.event.findMany({
      where: { clubId: req.params.clubId }
    });
    
    const eventIds = events.map(event => event.id);
    
    // Get registrations for these events
    const registrations = await prisma.eventRegistration.findMany({
      where: {
        eventId: { in: eventIds },
        attended: true
      }
    });
    
    // Calculate stats
    const totalAttendees = registrations.length;
    const totalHours = registrations.reduce((sum, reg) => sum + (reg.hoursEarned || 0), 0);
    
    res.json({
      clubId: req.params.clubId,
      totalEvents: events.length,
      totalAttendees,
      totalHours
    });
  } catch (error) {
    console.error('Error fetching club stats:', error);
    res.status(500).json({ error: 'Failed to fetch club stats' });
  }
});

// GET /api/stats/event/:eventId — Event-level stats
router.get('/event/:eventId', async (req, res) => {
  try {
    // Get registrations for this event
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: req.params.eventId }
    });
    
    // Calculate stats
    const totalRegistered = registrations.length;
    const totalAttended = registrations.filter(reg => reg.attended).length;
    const totalHours = registrations.reduce((sum, reg) => sum + (reg.hoursEarned || 0), 0);
    
    res.json({
      eventId: req.params.eventId,
      totalRegistered,
      totalAttended,
      totalHours,
      attendanceRate: totalRegistered > 0 ? (totalAttended / totalRegistered) * 100 : 0
    });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(500).json({ error: 'Failed to fetch event stats' });
  }
});

export default router;
