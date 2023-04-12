import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPaymentsByTicketId(req: AuthenticatedRequest, res: Response) {
  const payment = await paymentsService.getInfoPaymentByTicket();
  return res
    .status(httpStatus.OK)
    .send('Retorna informações sobre o pagamento (Payment) de um ingresso (Ticket). ' + payment);
}

export async function postPaymentsFromTicket(req: AuthenticatedRequest, res: Response) {
  const payment = await paymentsService.postPaymentFromTicket();
  return res.status(httpStatus.OK).send('Realiza o pagamento (Payment) de um ingresso (Ticket). ' + payment);
}
