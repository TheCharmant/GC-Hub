import { Router } from 'express';
import usersRouter from './routes/users';
import clubsRouter from './routes/clubs';
import authRouter from './routes/auth';
import eventsRouter from './routes/events';
import registrationsRouter from './routes/registrations';
import statsRouter from './routes/stats';
import reportsRouter from './routes/reports';
import adminRouter from './routes/admin';
import profileRouter from './routes/profile';
import utilsRouter from './routes/utils';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/events', eventsRouter);
router.use('/registrations', registrationsRouter);
router.use('/stats', statsRouter);
router.use('/clubs', clubsRouter);
router.use('/reports', reportsRouter);
router.use('/admin', adminRouter);
router.use('/profile', profileRouter);
router.use('/utils', utilsRouter);

export default router;
