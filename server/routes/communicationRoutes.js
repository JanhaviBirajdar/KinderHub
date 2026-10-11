import express from 'express';
import { 
  getAnnouncements, 
  createAnnouncement, 
  deleteAnnouncement,
  getMessages, 
  sendMessage, 
  getLeaveRequests, 
  createLeaveRequest, 
  updateLeaveStatus,
  deleteLeaveRequest
} from '../controllers/communicationController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/announcements', getAnnouncements);
router.post('/announcements', requireRoles('super_admin', 'school_admin', 'teacher'), createAnnouncement);
router.delete('/announcements/:id', requireRoles('super_admin', 'school_admin', 'teacher'), deleteAnnouncement);

router.get('/messages', getMessages);
router.post('/messages', sendMessage);

router.get('/leaves', getLeaveRequests);
router.post('/leaves', createLeaveRequest);
router.patch('/leaves/:id/status', requireRoles('super_admin', 'school_admin', 'teacher'), updateLeaveStatus);
router.delete('/leaves/:id', deleteLeaveRequest);

export default router;
