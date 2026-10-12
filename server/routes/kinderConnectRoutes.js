import express from 'express';
import {
  getDailyTimeline,
  createDailyLog,
  translateMessage,
  submitFeedback,
  updatePrivacySettings
} from '../controllers/kinderConnectController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/timeline/:childId', getDailyTimeline);
router.post('/daily-log', requireRoles('super_admin', 'school_admin', 'teacher'), createDailyLog);
router.post('/translate', translateMessage);
router.post('/feedback', submitFeedback);
router.put('/privacy/:childId', updatePrivacySettings);

export default router;
