import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotelAndRooms() {
  const hotel = await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });

  await prisma.room.create({
    data: {
      name: faker.name.findName(),
      hotelId: hotel.id,
      capacity: 9,
    },
  });

  return hotel;
}
