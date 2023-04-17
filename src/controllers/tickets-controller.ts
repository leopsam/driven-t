import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getTicketsByType(req: AuthenticatedRequest, res: Response) {
  const tickets = await ticketsService.getAllTicketsByType();
  return res.status(httpStatus.OK).send(tickets);
}

export async function getTicketsByUser(req: AuthenticatedRequest, res: Response) {
  const { email } = req.body;

  try {
    const ticketUser = await ticketsService.getAllTicketsFromUser(email);
    if (!ticketUser) return res.sendStatus(httpStatus.NOT_FOUND);
    if (ticketUser.length === 0) return res.send('The user has no tickets');

    return res.status(httpStatus.OK).send(ticketUser);
  } catch (e) {
    if (e.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function postCreateTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body;
  const { userId } = req;

  try {
    const newTickets = await ticketsService.postNewTicket(ticketTypeId, userId);
    if (!newTickets) return res.sendStatus(httpStatus.BAD_REQUEST);

    return res.status(httpStatus.OK).send(newTickets);
  } catch (e) {
    if (e.name === 'RequestError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
