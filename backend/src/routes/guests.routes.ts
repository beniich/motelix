import { Router } from 'express';
import { requireAuth } from '../domains/identity/auth/auth.middleware.js';
import {
  listGuests,
  getGuest,
  createGuest,
  updateGuest,
  deleteGuest,
} from '../controllers/guests.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', listGuests);
router.get('/:id', getGuest);
router.post('/', createGuest);
router.patch('/:id', updateGuest);
router.delete('/:id', deleteGuest);

export default router;
