import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPaymentsByTicketId(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketId } = req.query;
    const { userId } = req;

    const payment = await paymentsService.getInfoPaymentByTicket(Number(ticketId), Number(userId));
    if (!payment) return res.sendStatus(httpStatus.BAD_REQUEST);

    return res.status(httpStatus.OK).send(payment);
  } catch (e) {
    if (e.name === 'NoContent') return res.sendStatus(httpStatus.NO_CONTENT);
    if (e.name === 'InvalidDataError') return res.status(httpStatus.BAD_REQUEST).send(e.message);
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (e.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function postPaymentsFromTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketId, cardData } = req.body;
    const { userId } = req;

    const payment = await paymentsService.postPaymentFromTicket(Number(ticketId), Number(userId), cardData);
    return res.status(httpStatus.OK).send(payment);
  } catch (e) {
    if (e.name === 'NoContent') return res.sendStatus(httpStatus.NO_CONTENT);
    if (e.name === 'InvalidDataError') return res.status(httpStatus.BAD_REQUEST).send(e.message);
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (e.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
