import { prisma } from '@/config';

async function findTicketByEnrollmentId(enrollmentId: number) {
  const data = await prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
  });
  return data;
}

async function updateBookingFromUserByRoomId(id: number, roomId: number) {
  const data = await prisma.booking.update({
    where: {
      id,
    },
    data: {
      roomId,
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

async function findBooking() {
  return prisma.booking.findFirst({
    include: {
      Room: true,
    },
  });
}

async function findRoonsFromBookingByUserId(userId: number) {
  const data = await prisma.booking.findFirst({
    where: {
      userId,
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

async function findRoonsById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });
}

async function createBookingByRoomId(userId: number, roomId: number) {
  const data = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
  return data;
}

const hotelRepository = {
  createBookingByRoomId,
  findTicketByEnrollmentId,
  findEnrollmentByUserId,
  findTicketTypeById,
  findBooking,
  findRoonsById,
  findRoonsFromBookingByUserId,
  updateBookingFromUserByRoomId,
};

export default hotelRepository;
