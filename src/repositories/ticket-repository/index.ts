import { prisma } from '@/config';

async function findManyTicketType() {
  return prisma.ticketType.findMany();
}

async function findManyTickets() {
  return prisma.ticket.findMany();
}

const ticketRepository = {
  findManyTicketType,
  findManyTickets,
};

export default ticketRepository;
