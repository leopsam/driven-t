import { prisma } from '@/config';

async function findTicketById(ticketId: number) {
  const data = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
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

async function createPaymentFromTicket(ticketId: number, cardIssuer: string, cardLastDigits: string, value: number) {
  const data = await prisma.payment.create({
    data: {
      ticketId,
      cardIssuer,
      cardLastDigits,
      value,
    },
  });
  return data;
}

async function findTicketFromToUser(id: number, userId: number) {
  return prisma.ticket.findFirst({
    where: {
      id,
      Enrollment: {
        userId,
      },
    },
  });
}

async function updateTicketStatus(id: number) {
  return prisma.ticket.update({
    where: {
      id,
    },
    data: {
      status: 'PAID',
    },
  });
}

async function findPaymentFromUser(ticketId: number, userId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
      Ticket: {
        Enrollment: {
          userId,
        },
      },
    },
  });
}

const paymentRepository = {
  updateTicketStatus,
  findTicketFromToUser,
  findTicketById,
  findPaymentByTicketId,
  findEnrollmentByUserId,
  createPaymentFromTicket,
  findPaymentFromUser,
};

export default paymentRepository;
