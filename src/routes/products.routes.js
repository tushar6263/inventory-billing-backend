import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock
} from '../controllers/products.controller.js';

const router = Router();

router.get('/products', auth, listProducts);
router.post('/products', auth, createProduct);
router.put('/products/:id', auth, updateProduct);
router.delete('/products/:id', auth, deleteProduct);
router.post('/products/:id/stock', auth, adjustStock);

export default router;
