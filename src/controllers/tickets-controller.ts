import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getTicketsByType(req: AuthenticatedRequest, res: Response) {
  const tickets = await ticketsService.getAllTicketsByType();
  return res.status(httpStatus.OK).send(tickets);
}

export async function getTicketsByUser(req: AuthenticatedRequest, res: Response) {
  const tickets = await ticketsService.getAllTickets();
  return res.status(httpStatus.OK).send(tickets);
}

export async function postCreateTicket(req: AuthenticatedRequest, res: Response) {
  //const newTicket = req.body;
  const tickets = ticketsService.postNewTicket();
  return res.status(httpStatus.OK).send('Cria no sistema um novo ingresso (Ticket) para o usuário. ' + tickets);
}
