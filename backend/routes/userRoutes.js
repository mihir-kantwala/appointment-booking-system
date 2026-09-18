import { Router } from 'express';
const router = Router();

import {
  getServices,
  getSlots,
  bookedASlot,
} from '../controllers/userController.js';
import { serviecSlotExist } from '../middlewares/serviceSlotMiddleware.js';
import { validateCredentials } from '../middlewares/validateCredentianls.js';

router.get('/services', getServices);
router.get('/slots', getSlots);
router.post('/bookings', validateCredentials, serviecSlotExist, bookedASlot);

export default router;
