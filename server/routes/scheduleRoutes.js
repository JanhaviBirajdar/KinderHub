import express from 'express';
import { getTimetables, getEvents, createEvent, updateEvent, deleteEvent, updateTimetable } from '../controllers/scheduleController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/timetable', getTimetables);
router.put('/timetable', requireRoles('super_admin', 'school_admin'), updateTimetable);
router.get('/events', getEvents);
router.post('/events', requireRoles('super_admin', 'school_admin'), createEvent);
router.put('/events/:id', requireRoles('super_admin', 'school_admin'), updateEvent);
router.delete('/events/:id', requireRoles('super_admin', 'school_admin'), deleteEvent);

export default router;
