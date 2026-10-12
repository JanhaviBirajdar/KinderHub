import express from 'express';
import {
  getGuardiansAndSafetyProfile,
  generatePickupPass,
  verifyPickupPass,
  confirmPickupHandover,
  getPickupAuditHistory,
  getEmergencyAccountability,
  getIncidents,
  createIncident,
  updateIncident
} from '../controllers/kinderSafeController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

// Child safety & guardian list
router.get('/guardians/:childId', getGuardiansAndSafetyProfile);

// Pickup passes
router.post('/passes/generate', generatePickupPass);
router.post('/passes/verify', requireRoles('super_admin', 'school_admin', 'teacher'), verifyPickupPass);
router.post('/passes/confirm', requireRoles('super_admin', 'school_admin', 'teacher'), confirmPickupHandover);
router.get('/audit-history', requireRoles('super_admin', 'school_admin', 'teacher'), getPickupAuditHistory);

// Emergency reunification & live accountability
router.get('/emergency-accountability', requireRoles('super_admin', 'school_admin', 'teacher'), getEmergencyAccountability);

// Incidents
router.get('/incidents', getIncidents);
router.post('/incidents', requireRoles('super_admin', 'school_admin', 'teacher'), createIncident);
router.patch('/incidents/:id', requireRoles('super_admin', 'school_admin', 'teacher'), updateIncident);

export default router;
