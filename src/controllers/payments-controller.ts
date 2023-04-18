import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPaymentsByTicketId(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query;
  const { userId } = req;

  try {
    const payment = await paymentsService.getInfoPaymentByTicket(Number(ticketId), Number(userId));
    if (!payment) return res.sendStatus(httpStatus.BAD_REQUEST);

    return res.status(httpStatus.OK).send(payment);
  } catch (e) {
    if (e.name === 'RequestError') return res.sendStatus(httpStatus.BAD_REQUEST); //400
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND); //404
    if (e.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED); //401
  }
}

export async function postPaymentsFromTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketId, cardData } = req.body;
  const { userId } = req;

  try {
    const payment = await paymentsService.postPaymentFromTicket(Number(ticketId), Number(userId), cardData);
    return res.status(httpStatus.OK).send(payment);
  } catch (e) {
    if (e.name === 'NoContent') return res.sendStatus(httpStatus.NO_CONTENT);
    if (e.name === 'InvalidDataError') return res.status(httpStatus.BAD_REQUEST).send(e.message);
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (e.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
