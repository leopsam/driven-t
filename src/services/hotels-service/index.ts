import { notFoundError, requestError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';

async function getAllInfoHotels(hotelId: number, userId: number) {
  const enrollment = await hotelRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await hotelRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID') throw requestError(402, 'paid request');

  const ticketType = await hotelRepository.findTicketTypeById(ticket.ticketTypeId);

  if (ticketType.isRemote === true) throw requestError(402, 'paid request');
  if (ticketType.includesHotel === false) throw requestError(402, 'paid request');

  const hotels = await hotelRepository.findAllHotels();
  if (!hotels) throw notFoundError();
  if (hotels.length === 0) throw notFoundError();

  if (!hotelId) return hotels;

  if (hotelId) {
    const hotel = await hotelRepository.findHotelById(hotelId);
    if (!hotel) throw notFoundError();

    const roons = await hotelRepository.findRoonsByIdHotel(hotelId);

    return roons;
  }
}

async function getInfoHotelById(hotelId: number, userId: number) {
  const enrollment = await hotelRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await hotelRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const hotel = await hotelRepository.findHotelById(hotelId);
  if (!hotel) throw notFoundError();

  if (ticket.status !== 'PAID') throw requestError(402, 'paid request');

  const ticketType = await hotelRepository.findTicketTypeById(ticket.ticketTypeId);

  if (ticketType.isRemote === true) throw requestError(402, 'paid request');
  if (ticketType.includesHotel === false) throw requestError(402, 'paid request');

  const roons = await hotelRepository.findRoonsByIdHotel(hotelId);

  return roons;
}

const hotelsService = {
  getAllInfoHotels,
  getInfoHotelById,
};

export default hotelsService;
