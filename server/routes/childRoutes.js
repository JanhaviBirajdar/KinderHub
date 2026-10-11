import express from 'express';
import { getChildren, getChildById, createChild, updateChild, archiveChild, deleteChildPermanent } from '../controllers/childController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', getChildren);
router.get('/:id', getChildById);
router.post('/', requireRoles('super_admin', 'school_admin'), createChild);
router.put('/:id', requireRoles('super_admin', 'school_admin', 'teacher'), updateChild);
router.patch('/:id/archive', requireRoles('super_admin', 'school_admin'), archiveChild);
router.delete('/:id', requireRoles('super_admin', 'school_admin'), archiveChild);
router.delete('/:id/permanent', requireRoles('super_admin', 'school_admin'), deleteChildPermanent);

export default router;
