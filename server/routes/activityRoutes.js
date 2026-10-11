import express from 'express';
import { getActivities, createActivity, getProgressRecords, createProgressRecord, deleteActivity, deleteProgressRecord } from '../controllers/activityController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', getActivities);
router.post('/', requireRoles('super_admin', 'school_admin', 'teacher'), createActivity);
router.delete('/:id', requireRoles('super_admin', 'school_admin', 'teacher'), deleteActivity);
router.get('/progress', getProgressRecords);
router.post('/progress', requireRoles('super_admin', 'school_admin', 'teacher'), createProgressRecord);
router.delete('/progress/:id', requireRoles('super_admin', 'school_admin', 'teacher'), deleteProgressRecord);

export default router;
