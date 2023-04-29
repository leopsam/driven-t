import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/bookings-service';

export async function getInfoBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const booking = await bookingsService.getInfoBooking();

    return res.status(httpStatus.OK).send(booking);
  } catch (e) {
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body;
  const { userId } = req;

  try {
    const booking = await bookingsService.postNewBooking(roomId, userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (e) {
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (e.name === 'RequestError') return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function putBookingById(req: AuthenticatedRequest, res: Response) {
  try {
    const { bookingId } = req.params;
    const { roomId } = req.body;
    const { userId } = req;

    const booking = await bookingsService.putBookingById(Number(bookingId), Number(userId), Number(roomId));

    return res.status(httpStatus.OK).send(booking);
  } catch (e) {
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (e.name === 'RequestError') return res.sendStatus(httpStatus.FORBIDDEN).send(e.statusText);
  }
}
