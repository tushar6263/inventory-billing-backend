import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  listContacts,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/contacts.controller.js';

const router = Router();

router.get('/contacts', auth, listContacts);
router.post('/contacts', auth, createContact);
router.put('/contacts/:id', auth, updateContact);
router.delete('/contacts/:id', auth, deleteContact);

export default router;
