import { Router } from 'express';
import { prisma } from '@lib/prisma';
import { authenticate, authorize } from '../middleware/auth';
import { ReportType } from '@prisma/client';

const router = Router();

// GET /api/reports - Get all reports
router.get('/', authenticate, authorize(['admin', 'organizer']), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    let whereClause = {};

    if (userRole === 'organizer' && userId) {
      whereClause = { userId: userId };
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
      include: {
        generatedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(reports);
  } catch (error) {
    console.error('Reports fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// POST /api/reports/generate - Generate a new report
router.post('/generate', authenticate, authorize(['admin', 'organizer']), async (req, res) => {
  try {
    const { type, filters } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate report type
    if (!Object.values(ReportType).includes(type)) {
      return res.status(400).json({ error: 'Invalid report type' });
    }

    // Generate report based on type
    let reportData;
    switch (type) {
      case 'event_summary':
        reportData = await generateEventSummaryReport(filters, userId);
        break;
      case 'attendance':
        reportData = await generateAttendanceReport(filters, userId);
        break;
      case 'hours':
        reportData = await generateHoursReport(filters, userId);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported report type' });
    }

    // Create report record
    const report = await prisma.report.create({
      data: {
        type,
        filters,
        fileUrl: reportData.fileUrl,
        userId
      },
      include: {
        generatedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Helper functions for report generation
async function generateEventSummaryReport(filters: any, userId: string) {
  // Implement event summary report generation for a specific organizer
  // This would typically involve querying the database for events managed by userId
  // and then generating the report based on those events.
  return {
    fileUrl: '/reports/event-summary.pdf' // Placeholder
  };
}

async function generateAttendanceReport(filters: any, userId: string) {
  // Implement attendance report generation for a specific organizer
  // Query attendance records for events managed by userId.
  return {
    fileUrl: '/reports/attendance.pdf' // Placeholder
  };
}

async function generateHoursReport(filters: any, userId: string) {
  // Implement hours report generation for a specific organizer
  // Query hours records for events managed by userId.
  return {
    fileUrl: '/reports/hours.pdf' // Placeholder
  };
}

export default router;
