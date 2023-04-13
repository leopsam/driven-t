import { prisma } from '@/config';
import { PostResultTichets } from '@/services';

async function findManyTicketType() {
  return prisma.ticketType.findMany();
}

async function findUserByEmailFromTicket(email: string) {
  const data = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return data;
}

async function findUserByIdFromTicket(id: number) {
  const data = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return data;
}

async function findEnrollmentByIdFromTicket(userId: number) {
  const data = await prisma.enrollment.findUnique({
    where: {
      userId,
    },
  });
  return data;
}

async function findManyTicketsFromUser(enrollmentId: number) {
  const data = await prisma.ticket.findMany({
    where: {
      enrollmentId,
    },
  });
  return data;
}

async function findTicketTypeById(id: number) {
  const data = await prisma.ticketType.findFirst({
    where: {
      id,
    },
  });
  return data;
}

async function createNewTicketFromUserAndType(ticket: PostResultTichets) {
  const data = await prisma.ticket.create({
    data: ticket,
  });
  return data;
}

const ticketRepository = {
  findManyTicketType,
  findManyTicketsFromUser,
  findUserByEmailFromTicket,
  findEnrollmentByIdFromTicket,
  findTicketTypeById,
  findUserByIdFromTicket,
  createNewTicketFromUserAndType,
};

export default ticketRepository;
