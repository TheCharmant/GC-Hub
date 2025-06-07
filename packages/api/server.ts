import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import eventsRoutes from './routes/events';
import clubsRoutes from './routes/clubs';
import statsRoutes from './routes/stats';
import profileRoutes from './routes/profile';
import adminRoutes from './routes/admin';
import reportsRoutes from './routes/reports';
import utilsRoutes from './routes/utils';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/utils', utilsRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
