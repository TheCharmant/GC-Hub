import { Router } from 'express';
import { prisma } from '@lib/prisma';
import { ReportType } from '@prisma/client';

const router = Router();

// GET /api/reports — List available reports
router.get('/', async (_req, res) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// POST /api/reports/generate — Generate new report
router.post('/generate', async (req, res) => {
  try {
    const { title, type, startDate, endDate, clubId, eventId } = req.body;
    
    // In production, get user ID from JWT token
    const createdById = req.headers['user-id'] as string;
    
    if (!createdById) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Generate report data based on type
    let data: Record<string, any> = {};
    
    if (type === 'event_summary' && eventId) {
      // Get event details and registrations
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          registrations: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      data = {
        event,
        totalRegistered: event.registrations.length,
        totalAttended: event.registrations.filter(reg => reg.attended).length,
        totalHours: event.registrations.reduce((sum, reg) => sum + (reg.hoursEarned || 0), 0)
      };
    } else if (type === 'attendance' && clubId) {
      // Get club events and attendance
      const events = await prisma.event.findMany({
        where: {
          clubId,
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        include: {
          registrations: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });
      
      data = {
        events,
        totalEvents: events.length,
        totalAttendees: events.reduce((sum, event) => 
          sum + event.registrations.filter(reg => reg.attended).length, 0)
      };
    } else if (type === 'hours') {
      // Get hours by student
      const registrations = await prisma.eventRegistration.findMany({
        where: {
          attended: true,
          event: {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          event: true
        }
      });
      
      // Group by user
      const userHours: Record<string, {
        user: { id: string; name: string; email: string };
        totalHours: number;
        events: any[];
      }> = {};
      
      registrations.forEach(reg => {
        const userId = reg.user.id;
        if (!userHours[userId]) {
          userHours[userId] = {
            user: reg.user,
            totalHours: 0,
            events: []
          };
        }
        userHours[userId].totalHours += reg.hoursEarned || 0;
        userHours[userId].events.push(reg.event);
      });
      
      data = {
        userHours: Object.values(userHours),
        totalUsers: Object.keys(userHours).length,
        totalHours: registrations.reduce((sum, reg) => sum + (reg.hoursEarned || 0), 0)
      };
    }
    
    // Create report
    const report = await prisma.report.create({
      data: {
        generatedBy: {
          connect: { id: createdById }
        },
        type: type as ReportType,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        clubId,
        eventId,
        filters: data,
        fileUrl: `report-${Date.now()}.pdf`
      }
    });
    
    res.status(201).json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// GET /api/reports/export — Export reports (CSV/PDF)
router.get('/export', async (req, res) => {
  try {
    const { id, format = 'csv' } = req.query;
    
    const report = await prisma.report.findUnique({
      where: { id: id as string }
    });
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    // Parse report data
    const data = report.filters;
    
    // In a real implementation, generate CSV or PDF here
    if (format === 'csv') {
      // Example CSV generation
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="report-${report.id}.csv"`);
      res.send('Sample CSV data');
    } else if (format === 'pdf') {
      // Example PDF generation
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="report-${report.id}.pdf"`);
      res.send('Sample PDF data');
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({ error: 'Failed to export report' });
  }
});

export default router;
