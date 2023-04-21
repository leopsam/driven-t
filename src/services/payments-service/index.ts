import { Payment } from '@prisma/client';
import { invalidDataError, notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { BodyProcess } from '@/protocols';

async function getInfoPaymentByTicket(ticketId: number, userId: number) {
  if (!ticketId) throw invalidDataError(['Ticket id is required']);

  const ticket = await paymentRepository.findTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const ticketUser = await paymentRepository.findPaymentFromUser(ticket.id, userId);
  if (!ticketUser) throw unauthorizedError();

  const payment = await paymentRepository.findPaymentByTicketId(ticket.id);
  if (!payment) throw notFoundError();

  return payment;
}

async function postPaymentFromTicket(paymentsBody: BodyProcess, userId: number) {
  if (!paymentsBody.cardData || !paymentsBody.ticketId) throw invalidDataError(['Ticket and cardData are required']);

  const ticket = await paymentRepository.findTicketById(paymentsBody.ticketId);
  if (!ticket) throw notFoundError();

  const ticketFromToUser = await paymentRepository.findTicketFromToUser(paymentsBody.ticketId, userId);
  if (!ticketFromToUser) throw unauthorizedError();

  await paymentRepository.updateTicketStatus(paymentsBody.ticketId);

  const cardIssuer = paymentsBody.cardData.issuer;
  const cardLastDigits = String(paymentsBody.cardData.number).slice(-4);
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
