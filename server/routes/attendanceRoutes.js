import express from 'express';
import { getAttendanceByDateAndClass, saveAttendance, getAttendanceStats } from '../controllers/attendanceController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', getAttendanceByDateAndClass);
router.post('/', requireRoles('super_admin', 'school_admin', 'teacher'), saveAttendance);
router.post('/mark', requireRoles('super_admin', 'school_admin', 'teacher'), saveAttendance);
router.get('/stats', getAttendanceStats);

export default router;
