import { Router } from 'express';
import { prisma } from '@lib/prisma';
import { authenticate, authorize } from '../middleware/auth';
import { ReportType } from '@prisma/client';

const router = Router();

// GET /api/reports - Get all reports
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
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
router.post('/generate', authenticate, authorize(['admin']), async (req, res) => {
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
        reportData = await generateEventSummaryReport(filters);
        break;
      case 'attendance':
        reportData = await generateAttendanceReport(filters);
        break;
      case 'hours':
        reportData = await generateHoursReport(filters);
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
async function generateEventSummaryReport(filters: any) {
  // Implement event summary report generation
  // This would typically involve querying the database and formatting the data
  return {
    fileUrl: '/reports/event-summary.pdf' // Placeholder
  };
}

async function generateAttendanceReport(filters: any) {
  // Implement attendance report generation
  return {
    fileUrl: '/reports/attendance.pdf' // Placeholder
  };
}

async function generateHoursReport(filters: any) {
  // Implement hours report generation
  return {
    fileUrl: '/reports/hours.pdf' // Placeholder
  };
}

export default router;
