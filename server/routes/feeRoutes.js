import express from 'express';
import { getInvoices, getInvoiceById, createInvoice, recordPayment, getFeeStructures, getFeeSummaries, deleteInvoice } from '../controllers/feeController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoiceById);
router.post('/invoices', requireRoles('super_admin', 'school_admin'), createInvoice);
router.delete('/invoices/:id', requireRoles('super_admin', 'school_admin'), deleteInvoice);
router.post('/payments', recordPayment); // parents can make demo payments, admins can record cash/wire
router.get('/structures', getFeeStructures);
router.get('/summaries', getFeeSummaries);

export default router;
