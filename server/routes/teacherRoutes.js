import express from 'express';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../controllers/teacherController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', getTeachers);
router.post('/', requireRoles('super_admin', 'school_admin'), createTeacher);
router.put('/:id', requireRoles('super_admin', 'school_admin'), updateTeacher);
router.delete('/:id', requireRoles('super_admin', 'school_admin'), deleteTeacher);

export default router;
