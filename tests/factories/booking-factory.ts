import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createBookingCapacityExceeded(userId: number) {
  const hotel = await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });

  const room = await prisma.room.create({
    data: {
      name: faker.name.findName(),
      hotelId: hotel.id,
      capacity: 2,
    },
  });
  await prisma.booking.create({
    data: {
      userId: userId,
      roomId: room.id,
    },
  });

  const booking = await prisma.booking.create({
    data: {
      userId: userId,
      roomId: room.id,
    },
  });

  return booking;
}

export async function createBooking(userId: number) {
  const hotel = await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });

  const room = await prisma.room.create({
    data: {
      name: faker.name.findName(),
      hotelId: hotel.id,
      capacity: 9,
    },
  });

  const booking = await prisma.booking.create({
    data: {
      userId: userId,
      roomId: room.id,
    },
  });

  return booking;
}

export async function createHotelAndRoons() {
  const hotel = await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });

  const room = await prisma.room.create({
    data: {
      name: faker.name.findName(),
      hotelId: hotel.id,
      capacity: 9,
    },
  });

  return { hotel, room };
}
