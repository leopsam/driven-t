import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getInfoBooking, postBooking, putBookingById } from '@/controllers/booking-controller'; //trocar

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getInfoBooking)
  .post('/', postBooking)
  .put('/:bookingId', putBookingById);

export { bookingsRouter };
