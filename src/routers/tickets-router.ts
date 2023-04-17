import { Router } from 'express';
import { createTicketSchema } from '@/schemas';
import { authenticateToken, validateBody } from '@/middlewares';
import { postCreateTicket, getTicketsByType, getTicketsByUser } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsByType)
  .get('/', getTicketsByUser)
  .post('/', validateBody(createTicketSchema), postCreateTicket);

export { ticketsRouter };
