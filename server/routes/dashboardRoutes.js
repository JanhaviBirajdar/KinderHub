import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { verifyToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/summary', authorize('super_admin', 'school_admin'), getDashboardSummary);

export default router;
