import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getInfoAllHotelsOrHotelById(req: AuthenticatedRequest, res: Response) {
  try {
    const { hotelId } = req.query;
    const { userId } = req;

    const hotel = await hotelsService.getAllInfoHotels(Number(userId));
    if (!hotel) return res.sendStatus(httpStatus.BAD_REQUEST);

    /*
    if (!hotelId) {
      console.log('/hotels');
      console.log(userId);
      console.log(hotelId);
      const payment = await hotelsService.getAllInfoHotels(Number(hotelId), Number(userId));
      if (!payment) return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    if (hotelId) {
      console.log('/hotels/:hotelsId');
      console.log(userId);
      console.log(hotelId);
      const payment = await hotelsService.getAllInfoHotels(Number(hotelId), Number(userId));
      if (!payment) return res.sendStatus(httpStatus.BAD_REQUEST);
    }
*/
    //const payment = await hotelsService.getInfoPaymentByTicket(Number(ticketId), Number(userId));
    //if (!payment) return res.sendStatus(httpStatus.BAD_REQUEST);

    //return res.status(httpStatus.OK).send(userId);
  } catch (e) {
    if (e.name === 'NoContent') return res.sendStatus(httpStatus.NO_CONTENT);
    if (e.name === 'InvalidDataError') return res.status(httpStatus.BAD_REQUEST).send(e.message);
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (e.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (e.name === 'RequestError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED).send(e.statusText);
  }
}
