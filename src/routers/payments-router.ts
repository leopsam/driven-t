import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createPayment } from '@/schemas';
import { getPaymentsByTicketId, postPaymentsFromTicket } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/:ticketId', getPaymentsByTicketId)
  .post('/process', validateBody(createPayment), postPaymentsFromTicket);

export { paymentsRouter };
