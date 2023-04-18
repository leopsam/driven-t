import { Payment } from '@prisma/client';
import { invalidDataError, notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { CardData } from '@/protocols';

async function getInfoPaymentByTicket(ticketId: number, userId: number) {
  if (!ticketId) throw invalidDataError(['Ticket identifier not found, required']);

  const ticket = await paymentRepository.findTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const ticketUser = await paymentRepository.findPaymentFromUser(ticket.id, userId);
  if (!ticketUser) throw unauthorizedError();

  const payment = await paymentRepository.findPaymentByTicketId(ticket.id);
  if (!payment) throw notFoundError();

  return payment;
}

async function postPaymentFromTicket(ticketId: number, userId: number, cardData: CardData) {
  if (!cardData || !ticketId) throw invalidDataError(['Ticket id and card data are required']);

  const ticket = await paymentRepository.findTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const ticketFromToUser = await paymentRepository.findTicketFromToUser(ticketId, userId);
  if (!ticketFromToUser) throw unauthorizedError();

  await paymentRepository.updateTicketStatus(ticketId);

  const cardIssuer = cardData.issuer;
  const cardLastDigits = String(cardData.number).slice(-4);
  const ticketType = await ticketRepository.findTicketTypeById(ticket.ticketTypeId);

  const payment = await paymentRepository.createPaymentFromTicket(
    ticket.id,
    cardIssuer,
    cardLastDigits,
    Number(ticketType.price),
  );

  return payment;
}

export type PostResultPayment = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

const paymentsService = {
  getInfoPaymentByTicket,
  postPaymentFromTicket,
};

export default paymentsService;
