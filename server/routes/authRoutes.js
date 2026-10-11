import express from 'express';
import { login, getMe, changePassword, forgotPassword, resetPassword, getDemoUsers } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.post('/change-password', verifyToken, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/demo-users', getDemoUsers);

export default router;
