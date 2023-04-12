import { Router } from 'express';
//import { authenticateToken } from '@/middlewares';
import { postCreateTicket, getTicketsByType, getTicketsByUser } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter
  //.all('/*', authenticateToken)
  .get('/types', getTicketsByType)
  .get('/', getTicketsByUser)
  .post('/', postCreateTicket);

export { ticketsRouter };
