import express from 'express';
import { getClasses, getClassById, createClass, updateClass, deleteClass } from '../controllers/classController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', getClasses);
router.get('/:id', getClassById);
router.post('/', requireRoles('super_admin', 'school_admin'), createClass);
router.put('/:id', requireRoles('super_admin', 'school_admin'), updateClass);
router.delete('/:id', requireRoles('super_admin', 'school_admin'), deleteClass);

export default router;
