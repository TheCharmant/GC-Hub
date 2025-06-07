import { Router } from 'express';
import { prisma } from '@lib/prisma';

const router = Router();

// GET /api/profile — Get own profile
router.get('/', async (req, res) => {
  try {
    // In production, get user ID from JWT token
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profile — Update personal profile
router.put('/', async (req, res) => {
  try {
    // In production, get user ID from JWT token
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { name, email } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/profile/club — Club leader: get club info
router.get('/club', async (req, res) => {
  try {
    // In production, get user ID from JWT token
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Find club where user is leader
    const club = await prisma.club.findFirst({
      where: { leaderId: userId },
      include: {
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
    console.error('Error fetching club profile:', error);
    res.status(500).json({ error: 'Failed to fetch club profile' });
  }
});

// PUT /api/profile/club — Club leader: update club info
router.put('/club', async (req, res) => {
  try {
    // In production, get user ID from JWT token
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Find club where user is leader
    const club = await prisma.club.findFirst({
      where: { leaderId: userId }
    });
    
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }
    
    const { name, description } = req.body;
    
    const updatedClub = await prisma.club.update({
      where: { id: club.id },
      data: { name, description }
    });
    
    res.json(updatedClub);
  } catch (error) {
    console.error('Error updating club profile:', error);
    res.status(500).json({ error: 'Failed to update club profile' });
  }
});

export default router;
