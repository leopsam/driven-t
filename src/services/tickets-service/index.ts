import { Ticket } from '@prisma/client';
import { notFoundError, requestError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function getAllTicketsByType() {
  const ticketsTypes = await ticketRepository.findManyTicketType();
  return ticketsTypes;
}

async function getAllTicketsFromUser(userId: number) {
  const enrollment = await ticketRepository.findEnrollmentByIdFromTicket(userId);
  if (!enrollment) throw notFoundError();

  const tickets = await ticketRepository.findManyTicketsFromUser(enrollment.id);
  if (!tickets) throw notFoundError();

  return tickets;
}

async function postNewTicket(ticketTypeId: number, userId: number) {
  const user = await ticketRepository.findUserByIdFromTicket(userId);
  if (!user) throw notFoundError();

  const ticketType = await ticketRepository.findTicketTypeById(ticketTypeId);
  if (!ticketType) throw requestError(400, 'there is no such ticket');

  const enrollment = await ticketRepository.findEnrollmentByIdFromTicket(userId);
  if (!enrollment) throw notFoundError();

  const dataNewTicket: PostResultTichets = {
    ticketTypeId: ticketTypeId,
    enrollmentId: enrollment.id,
    status: 'RESERVED',
  };

  const ticketCreated = await ticketRepository.createNewTicketFromUserAndType(dataNewTicket);

  return ticketCreated;
}

export type PostResultTichets = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

const ticketsService = {
  getAllTicketsByType,
  getAllTicketsFromUser,
  postNewTicket,
};

export default ticketsService;
