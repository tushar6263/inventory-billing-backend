import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { inventoryReport, transactionsReport } from '../controllers/reports.controller.js';

const router = Router();

router.get('/reports/inventory', auth, inventoryReport);
router.get('/reports/transactions', auth, transactionsReport);

export default router;
