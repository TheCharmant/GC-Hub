import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/events — Get all events
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
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

// GET /api/events/:id — Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
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
router.post('/', authenticate, authorize(['club']), async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, location, clubId } = req.body;
    
    // Get user ID from authenticated request
    const createdById = req.user?.userId;
    
    if (!createdById) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Verify user is the club leader
    const club = await prisma.club.findFirst({
      where: {
        id: clubId,
        leaderId: createdById
      }
    });
    
    if (!club) {
      return res.status(403).json({ error: 'You are not authorized to create events for this club' });
    }
    
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
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
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
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT /api/events/:id — Update event
router.put('/:id', authenticate, authorize(['club']), async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, location } = req.body;
    const eventId = req.params.id;
    const userId = req.user?.userId;
    
    // Verify user is the club leader
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        club: true
      }
    });
    
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    if (!existingEvent.club || existingEvent.club.leaderId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this event' });
    }
    
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
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
    
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id — Delete event
router.delete('/:id', authenticate, authorize(['club']), async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user?.userId;
    
    // Verify user is the club leader
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        club: true
      }
    });
    
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    if (!existingEvent.club || existingEvent.club.leaderId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this event' });
    }
    
    await prisma.event.delete({
      where: { id: eventId }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;