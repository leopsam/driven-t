import { prisma } from '@/config';

async function findTicketByEnrollmentId(enrollmentId: number) {
  const data = await prisma.ticket.findFirst({
    where: {
      enrollmentId,
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

async function findTicketTypeById(ticketTypeId: number) {
  const data = await prisma.ticketType.findFirst({
    where: {
      id: ticketTypeId,
    },
  });
  return data;
}

async function findAllHotels() {
  return prisma.hotel.findMany({});
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

async function findHotelById(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
  });
}

async function findRoonsByIdHotel(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
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

const hotelRepository = {
  findRoonsByIdHotel,
  findTicketByEnrollmentId,
  findHotelById,
  findPaymentByTicketId,
  findEnrollmentByUserId,
  createPaymentFromTicket,
  findPaymentFromUser,
  findTicketTypeById,
  findAllHotels,
};

export default hotelRepository;
