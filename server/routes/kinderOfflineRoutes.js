import express from 'express';
import { syncOfflineQueue } from '../controllers/kinderOfflineController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/sync', requireRoles('super_admin', 'school_admin', 'teacher'), syncOfflineQueue);

export default router;
