import { Router } from 'express';
import { prisma } from '@lib/prisma';

const router = Router();

// GET /api/events — Browse all events (Feed)
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true
          }
        },
        club: {
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

// GET /api/events/:id — Get specific event details
router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true
          }
        },
        club: {
          select: {
            id: true,
            name: true
          }
        },
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST /api/events — Create event (Club Leader / Organizer)
router.post('/', async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, location, clubId } = req.body;
    
    // In production, get user ID from JWT token
    const createdById = req.headers['user-id'] as string;
    
    if (!createdById) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // In production, verify user is club leader or organizer
    
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location,
        createdById,
        clubId
      }
    });
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT /api/events/:id — Update event
router.put('/:id', async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, location } = req.body;
    
    // In production, verify user has permission to update this event
    
    const updatedEvent = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location
      }
    });
    
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id — Delete event (Organizer / Admin)
router.delete('/:id', async (req, res) => {
  try {
    // In production, verify user has permission to delete this event
    
    await prisma.event.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// POST /api/events/:id/register — Student registers for an event
router.post('/:id/register', async (req, res) => {
  try {
    // In production, get user ID from JWT token
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        eventId: req.params.id,
        userId
      }
    });
    
    if (existingRegistration) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }
    
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: req.params.id,
        userId
      }
    });
    
    res.status(201).json(registration);
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

// POST /api/events/:id/attend — Mark student attendance
router.post('/:id/attend', async (req, res) => {
  try {
    const { userId, hoursEarned } = req.body;
    
    // In production, verify user has permission to mark attendance
    
    const registration = await prisma.eventRegistration.findFirst({
      where: {
        eventId: req.params.id,
        userId
      }
    });
    
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    
    const updatedRegistration = await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: {
        attended: true,
        hoursEarned
      }
    });
    
    // Update user stats
    await prisma.stat.upsert({
      where: { userId },
      update: {
        totalEvents: { increment: 1 },
        totalHours: { increment: hoursEarned || 0 }
      },
      create: {
        userId,
        totalEvents: 1,
        totalHours: hoursEarned || 0
      }
    });
    
    res.json(updatedRegistration);
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

export default router;