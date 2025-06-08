import { Router } from 'express';
import { prisma } from '@lib/prisma';
import { authenticate } from '../middleware/auth';
import { Request, Response } from 'express';

const router = Router();

// GET /api/profile - Get own profile
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    console.log('Fetching profile for user:', userId);
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User found:', { id: user.id, name: user.name, email: user.email });
    
    // Remove sensitive data
    const { passwordHash, ...userData } = user;
    
    res.json(userData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profile - Update personal profile
router.put('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      console.log('No user ID found in request');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the current user to ensure they exist
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      console.log('User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, email, studentId, course, year, section, bio } = req.body;
    console.log('Received update data:', { name, email, studentId, course, year, section, bio });

    // Create update data object with only provided fields
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (studentId) updateData.studentId = studentId; // Use the field name from schema
    if (course) updateData.course = course;
    if (year) updateData.year = parseInt(year);
    if (section) updateData.section = section;
    if (bio !== undefined) updateData.bio = bio;

    console.log('Updating profile with data:', updateData);

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    // Remove sensitive data
    const { passwordHash, ...userData } = updatedUser;
    
    // Transform the response using type assertion
    const transformedUser = {
      ...userData,
      studentId: (userData as any).student_id
    };
    delete (transformedUser as any).student_id;

    console.log('Successfully updated user:', transformedUser);
    res.json(transformedUser);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    if (error.code) console.error('Error code:', error.code);
    if (error.meta) console.error('Error meta:', error.meta);
    res.status(500).json({ 
      error: 'Failed to update profile',
      details: error.message,
      code: error.code
    });
  }
});

// GET /api/profile/club - Club leader: get club info
router.get('/club', authenticate, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
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

// PUT /api/profile/club - Club leader: update club info
router.put('/club', authenticate, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
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
      data: { name, description },
      include: {
        events: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });
    
    res.json(updatedClub);
  } catch (error) {
    console.error('Error updating club profile:', error);
    res.status(500).json({ error: 'Failed to update club profile' });
  }
});

export default router;
