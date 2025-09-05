import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { listTransactions, createTransaction } from '../controllers/transactions.controller.js';

const router = Router();

router.get('/transactions', auth, listTransactions);
router.post('/transactions', auth, createTransaction);

export default router;
