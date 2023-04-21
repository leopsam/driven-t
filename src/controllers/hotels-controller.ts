import { Response } from 'express';
//import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
//import paymentsService from '@/services/payments-service';

export async function getInfoAllHotelsOrHotelById(req: AuthenticatedRequest, res: Response) {
  try {
    const { hotelId } = req.query;
    const { userId } = req;

    if (!hotelId) {
      console.log('/hotels');
      console.log(userId);
      console.log(hotelId);
    }

    if (hotelId) {
      console.log('/hotels/:hotelsId');
      console.log(userId);
      console.log(hotelId);
    }

    //const payment = await paymentsService.getInfoPaymentByTicket(Number(ticketId), Number(userId));
    //if (!payment) return res.sendStatus(httpStatus.BAD_REQUEST);

    //return res.status(httpStatus.OK).send(userId);
  } catch (e) {
    /* if (e.name === 'NoContent') return res.sendStatus(httpStatus.NO_CONTENT);
    if (e.name === 'InvalidDataError') return res.status(httpStatus.BAD_REQUEST).send(e.message);
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (e.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);*/
  }
}
