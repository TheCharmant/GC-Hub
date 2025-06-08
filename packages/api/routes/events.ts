import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/events — Get all approved events
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all approved events');
    
    const events = await prisma.event.findMany({
      where: {
        approved: true
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
            name: true,
            description: true
          }
        }
      }
    });

    console.log('Found events:', events.map(e => ({ id: e.id, title: e.title, club: e.club })));
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/my — Get events created by the authenticated user (Club Leader)
router.get('/my', authenticate, authorize(['club']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const events = await prisma.event.findMany({
      where: {
        createdById: userId
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
    res.json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ error: 'Failed to fetch user events' });
  }
});

// GET /api/events/:id — Get event by ID (only approved events for public, all for club leaders)
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching event by ID:', req.params.id);
    
    const event = await prisma.event.findUnique({
      where: { 
        id: req.params.id,
        // Only show approved events to public
        ...(req.user?.role !== 'club' ? { approved: true } : {})
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
            name: true,
            description: true
          }
        }
      }
    });
    
    if (!event) {
      console.log('Event not found:', req.params.id);
      return res.status(404).json({ error: 'Event not found' });
    }
    
    console.log('Found event:', {
      id: event.id,
      title: event.title,
      club: event.club,
      createdBy: event.createdBy
    });
    
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

    console.log('Creating event with data:', { 
      title, 
      description, 
      date, 
      startTime, 
      endTime, 
      location, 
      clubId, 
      createdById 
    });
    
    // First, verify the club exists and user is the leader
    const club = await prisma.club.findFirst({
      where: {
        id: clubId,
        leaderId: createdById
      }
    });
    
    if (!club) {
      console.error('Club not found or user is not the leader:', { clubId, createdById });
      return res.status(403).json({ error: 'You are not authorized to create events for this club' });
    }

    console.log('Found club:', club);
    
    // Create the event with the verified club
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location,
        createdById,
        clubId: club.id,
        approved: false // Events start as unapproved
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
            name: true,
            description: true
          }
        }
      }
    });

    console.log('Created event:', {
      id: event.id,
      title: event.title,
      club: event.club,
      createdBy: event.createdBy
    });
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get events for a specific club
router.get('/club/:clubId', async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    console.log('Fetching events for club:', clubId);
    console.log('User:', { userId, userRole });

    // Verify the club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId }
    });

    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    // If user is a club leader, verify they belong to this club
    if (userRole === 'club') {
      const userClub = await prisma.club.findFirst({
        where: {
          id: clubId,
          leaderId: userId
        }
      });

      if (!userClub) {
        return res.status(403).json({ error: 'You are not authorized to view this club\'s events' });
      }
    }

    const events = await prisma.event.findMany({
      where: {
        clubId: clubId
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    console.log(`Found ${events.length} events for club ${clubId}`);
    res.json(events);
  } catch (error) {
    console.error('Error fetching club events:', error);
    res.status(500).json({ error: 'Failed to fetch club events' });
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