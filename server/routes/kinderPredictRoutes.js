import express from 'express';
import {
  getPredictiveActionAlerts,
  resolveAlert
} from '../controllers/kinderPredictController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/alerts', requireRoles('super_admin', 'school_admin', 'teacher'), getPredictiveActionAlerts);
router.patch('/alerts/:alertId/resolve', requireRoles('super_admin', 'school_admin', 'teacher'), resolveAlert);

export default router;
