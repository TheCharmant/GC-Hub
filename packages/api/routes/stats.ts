import { Router } from 'express';
import { prisma } from '@lib/prisma';

const router = Router();

// GET /api/stats/user/:userId - Stats for a student
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's stats
    const stats = await prisma.stat.findUnique({
      where: { userId }
    });

    if (!stats) {
      return res.json({
        userId,
        totalEvents: 0,
        totalHours: 0
      });
    }

    res.json({
      userId: stats.userId,
      totalEvents: stats.totalEvents,
      totalHours: stats.totalHours
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// GET /api/stats/club/:clubId - Club-level participation stats
router.get('/club/:clubId', async (req, res) => {
  try {
    const { clubId } = req.params;

    // Get events by this club
    const events = await prisma.event.findMany({
      where: { clubId }
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
      clubId,
      totalEvents: events.length,
      totalAttendees,
      totalHours
    });
  } catch (error) {
    console.error('Error fetching club stats:', error);
    res.status(500).json({ error: 'Failed to fetch club statistics' });
  }
});

// GET /api/stats/event/:eventId - Event-level stats
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Get registrations for this event
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId }
    });
    
    // Calculate stats
    const totalRegistered = registrations.length;
    const totalAttended = registrations.filter(reg => reg.attended).length;
    const totalHours = registrations.reduce((sum, reg) => sum + (reg.hoursEarned || 0), 0);
    
    res.json({
      eventId,
      totalRegistered,
      totalAttended,
      totalHours,
      attendanceRate: totalRegistered > 0 ? (totalAttended / totalRegistered) * 100 : 0
    });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(500).json({ error: 'Failed to fetch event statistics' });
  }
});

export default router;
