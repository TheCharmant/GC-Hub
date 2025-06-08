import { Router } from 'express';
import { prisma } from '@lib/prisma';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// GET /api/registrations — Get all registrations (Admin/Organizer)
router.get('/', async (_req, res) => {
  try {
    // In production, verify user is admin or organizer
    
    const registrations = await prisma.eventRegistration.findMany({
      include: {
        event: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// GET /api/registrations/user/:userId — User's registered/attended events
router.get('/user/:userId', async (req, res) => {
  try {
    // In production, verify user has permission to view these registrations
    
    const registrations = await prisma.eventRegistration.findMany({
      where: { userId: req.params.userId },
      include: {
        event: true
      }
    });
    
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    res.status(500).json({ error: 'Failed to fetch user registrations' });
  }
});

// GET /api/registrations/event/:eventId — Attendee list for event
router.get('/event/:eventId', async (req, res) => {
  try {
    // In production, verify user has permission to view these registrations
    
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: req.params.eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({ error: 'Failed to fetch event registrations' });
  }
});

// PATCH /api/registrations/:id — Mark attendance or update status
router.patch('/:id', async (req, res) => {
  try {
    const { attended, hoursEarned } = req.body;
    
    // In production, verify user has permission to update this registration
    
    const registration = await prisma.eventRegistration.update({
      where: { id: req.params.id },
      data: { attended, hoursEarned }
    });
    
    // If marking as attended, update user stats
    if (attended && hoursEarned) {
      await prisma.stat.upsert({
        where: { userId: registration.userId },
        update: {
          totalEvents: { increment: 1 },
          totalHours: { increment: hoursEarned }
        },
        create: {
          userId: registration.userId,
          totalEvents: 1,
          totalHours: hoursEarned
        }
      });
    }
    
    res.json(registration);
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({ error: 'Failed to update registration' });
  }
});

// POST /api/registrations — Register for an event
router.post('/', authenticate, authorize(['student']), async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        userId,
        eventId
      }
    });

    if (existingRegistration) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        userId,
        eventId,
        attended: false,
        hoursEarned: null
      },
      include: {
        event: true
      }
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error('Error creating registration:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

export default router;