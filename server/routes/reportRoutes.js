import express from 'express';
import { getReportsData } from '../controllers/reportController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', requireRoles('super_admin', 'school_admin'), getReportsData);

export default router;
