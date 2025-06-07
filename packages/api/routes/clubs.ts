import { Router } from 'express';
import { prisma } from '@lib/prisma';

const router = Router();

// GET /api/clubs — Get all clubs
router.get('/', async (_req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    res.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({ error: 'Failed to fetch clubs' });
  }
});

// GET /api/clubs/:id — Get club info
router.get('/:id', async (req, res) => {
  try {
    const club = await prisma.club.findUnique({
      where: { id: req.params.id },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        events: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });
    
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }
    
    res.json(club);
  } catch (error) {
    console.error('Error fetching club:', error);
    res.status(500).json({ error: 'Failed to fetch club' });
  }
});

// PUT /api/clubs/:id — Update club info
router.put('/:id', async (req, res) => {
  try {
    const { name, description, leaderId } = req.body;
    
    // In production, verify user has permission to update this club
    
    const updatedClub = await prisma.club.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        leaderId
      }
    });
    
    res.json(updatedClub);
  } catch (error) {
    console.error('Error updating club:', error);
    res.status(500).json({ error: 'Failed to update club' });
  }
});

// POST /api/clubs — Create new club (Admin only)
router.post('/', async (req, res) => {
  try {
    const { name, description, leaderId } = req.body;

    // Simulate getting user ID and role from auth headers / token
    const userId = req.headers['user-id'] as string;
    const userRole = req.headers['user-role'] as string;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
    }

    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }

    // Optionally verify leaderId exists
    const leaderUser = await prisma.user.findUnique({ where: { id: leaderId } });
    if (!leaderUser) {
      return res.status(400).json({ error: 'Invalid leaderId: user does not exist' });
    }

    // Check if this leader already has a club
    const existingClub = await prisma.club.findUnique({ where: { leaderId } });
    if (existingClub) {
      return res.status(400).json({ error: 'This leader already has a club.' });
    }

    const club = await prisma.club.create({
      data: {
        name,
        description,
        leaderId
      }
    });

    res.status(201).json(club);
  } catch (error) {
    console.error('Error creating club:', error);
    res.status(500).json({ error: 'Failed to create club' });
  }
});



export default router;
