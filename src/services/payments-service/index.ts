import { Payment } from '@prisma/client';
import { notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function getInfoPaymentByTicket(ticketId: number, userId: number) {
  const user = await ticketRepository.findUserByIdFromTicket(userId);
  if (!user) throw unauthorizedError();

  const enrollment = await paymentRepository.findEnrollmentByUserId(user.id);
  if (!enrollment) throw unauthorizedError();

  const ticket = await paymentRepository.findTicketById(ticketId);
  if (!ticket) throw unauthorizedError();

  const paymwent = await paymentRepository.findPaymentByTicketId(ticketId);
  if (!paymwent) throw unauthorizedError();

  return paymwent;
}

async function postPaymentFromTicket(paymentBody: {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
}): Promise<Payment> {
  const ticket = await paymentRepository.findTicketById(paymentBody.ticketId);
  if (!ticket) throw unauthorizedError();

  const ticketType = await ticketRepository.findTicketTypeById(ticket.ticketTypeId);
  if (!ticketType) throw unauthorizedError();

  const newPayment: PostResultPayment = {
    ticketId: paymentBody.ticketId,
    value: ticketType.price,
    cardIssuer: paymentBody.cardData.issuer,
    cardLastDigits: paymentBody.cardData.name,
  };

  const response = await paymentRepository.createPaymentFromTicket(newPayment);

  return response;
}
export type PostResultPayment = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

const paymentsService = {
  getInfoPaymentByTicket,
  postPaymentFromTicket,
};

export default paymentsService;
