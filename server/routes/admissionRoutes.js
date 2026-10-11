import express from 'express';
import { getAdmissions, createAdmission, updateAdmissionStatus, convertToEnrolledChild, deleteAdmission } from '../controllers/admissionController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Parent enquiry submission
router.post('/', createAdmission);

// Admin-only management
router.get('/', verifyToken, requireRoles('super_admin', 'school_admin'), getAdmissions);
router.patch('/:id/status', verifyToken, requireRoles('super_admin', 'school_admin'), updateAdmissionStatus);
router.post('/:id/convert', verifyToken, requireRoles('super_admin', 'school_admin'), convertToEnrolledChild);
router.delete('/:id', verifyToken, requireRoles('super_admin', 'school_admin'), deleteAdmission);

export default router;
