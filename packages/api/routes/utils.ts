import { Router } from 'express';
import { prisma } from '@lib/prisma';

const router = Router();

// GET /api/utils/roles — List available roles
router.get('/roles', async (_req, res) => {
  try {
    // Return available roles from the Role enum
    const roles = ['student', 'club', 'organizer', 'admin'];
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// POST /api/utils/upload — Upload event images/files
router.post('/upload', async (req, res) => {
  try {
    // In a real implementation, handle file upload to storage service
    // This is a placeholder implementation
    
    // In production, get user ID from JWT token
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Mock file upload response
    res.json({
      success: true,
      fileUrl: `https://example.com/uploads/sample-${Date.now()}.jpg`,
      fileName: `sample-${Date.now()}.jpg`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;