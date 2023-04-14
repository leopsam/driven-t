import { prisma } from '@/config';
import { PostResultPayment } from '@/services';

async function findTicketById(id: number) {
  const data = await prisma.ticket.findFirst({
    where: {
      id,
    },
  });
  return data;
}

async function findPaymentByTicketId(ticketId: number) {
  const data = await prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
  return data;
}

async function findEnrollmentByUserId(userId: number) {
  const data = await prisma.enrollment.findFirst({
    where: {
      userId,
    },
  });
  return data;
}

async function createPaymentFromTicket(payment: PostResultPayment) {
  const data = await prisma.payment.create({
    data: payment,
  });
  return data;
}

const paymentRepository = {
  findTicketById,
  findPaymentByTicketId,
  findEnrollmentByUserId,
  createPaymentFromTicket,
};

export default paymentRepository;
