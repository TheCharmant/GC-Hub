import { Router } from 'express';
import { prisma } from '@lib/prisma';

const router = Router();

// GET /api/stats/user/:userId - Stats for a student
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's registrations with event data
    const registrations = await prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            club: true
          }
        }
      },
      orderBy: {
        registeredAt: 'desc'
      }
    });

    // Calculate stats
    const totalEvents = await prisma.event.count();
    const registeredEvents = registrations.length;
    const attendedEvents = registrations.filter(reg => reg.attended).length;
    const upcomingEvents = registrations.filter(reg => !reg.attended && new Date(reg.event.date) > new Date()).length;
    const totalHours = registrations.reduce((sum, reg) => sum + (reg.hoursEarned || 0), 0);

    // Get favorite clubs (clubs with most attended events)
    const clubAttendance = registrations
      .filter(reg => reg.attended && reg.event?.club)
      .reduce((acc, reg) => {
        const clubId = reg.event.club?.id;
        if (clubId) {
          acc[clubId] = (acc[clubId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    const favoriteClubs = Object.entries(clubAttendance)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([clubId]) => clubId);

    // Get recent activity
    const recentActivity = registrations.slice(0, 5).map(reg => ({
      eventId: reg.event.id,
      eventTitle: reg.event.title,
      date: reg.event.date,
      status: reg.attended ? 'attended' : 'registered',
      hoursEarned: reg.hoursEarned || 0
    }));

    res.json({
      userId,
      totalEvents,
      registeredEvents,
      attendedEvents,
      upcomingEvents,
      totalHours,
      favoriteClubs,
      recentActivity
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
