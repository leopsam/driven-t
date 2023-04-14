import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPaymentsByTicketId(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.params;
  const { userId } = req;

  try {
    if (ticketId === 'undefined' || ticketId === 'null' || ticketId === '0') {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const payment = await paymentsService.getInfoPaymentByTicket(Number(ticketId), userId);
    if (!payment) return res.sendStatus(httpStatus.BAD_REQUEST);

    return res.status(httpStatus.OK).send(payment);
  } catch (e) {
    if (e.name === 'RequestError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (e.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function postPaymentsFromTicket(req: AuthenticatedRequest, res: Response) {
  const paymentBody = req.body;

  try {
    if (!paymentBody.ticketId || !paymentBody.cardData) return res.sendStatus(httpStatus.BAD_REQUEST);

    const payment = await paymentsService.postPaymentFromTicket(paymentBody);
    return res.status(httpStatus.OK).send(payment);
  } catch (e) {
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
