import { Router } from 'express';
import { prisma } from '@lib/prisma';

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

export default router;