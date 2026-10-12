import express from 'express';
import {
  getChildGrowthProfile,
  getObservations,
  createObservation,
  generateAiSuggestions,
  reviewAiSuggestion,
  getMonthlySummary,
  publishMonthlySummary
} from '../controllers/kinderGrowthController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

// Developmental profile and self-comparison
router.get('/profile/:childId', getChildGrowthProfile);

// Observations
router.get('/observations', getObservations);
router.post('/observations', createObservation); // Teachers and parents (for home observations)

// AI Suggestions (Educator review workflow)
router.post('/ai-suggestions', requireRoles('super_admin', 'school_admin', 'teacher'), generateAiSuggestions);
router.patch('/ai-suggestions/:id/review', requireRoles('super_admin', 'school_admin', 'teacher'), reviewAiSuggestion);

// Monthly Summaries
router.get('/monthly-summary/:childId', getMonthlySummary);
router.post('/monthly-summary/:childId/publish', requireRoles('super_admin', 'school_admin', 'teacher'), publishMonthlySummary);

export default router;
