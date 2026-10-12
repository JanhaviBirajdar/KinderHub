import express from 'express';
import {
  getQuestJourney,
  completeQuestActivity,
  unlockChapter
} from '../controllers/kinderQuestController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/journey/:childId', getQuestJourney);
router.post('/complete-activity', completeQuestActivity);
router.patch('/unlock-chapter', requireRoles('super_admin', 'school_admin', 'teacher'), unlockChapter);

export default router;
