import { notFoundError, requestError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';

async function getInfoBooking() {
  const booking = await bookingRepository.findBooking();
  if (!booking) throw notFoundError();

  const result = {
    id: booking.id,
    Room: booking.Room,
  };

  return result;
}

async function postNewBooking(roomId: number, userId: number) {
  const enrollment = await bookingRepository.findEnrollmentByUserId(userId);
  const ticket = await bookingRepository.findTicketByEnrollmentId(enrollment.id);
  const ticketType = await bookingRepository.findTicketTypeById(ticket.ticketTypeId);

  if (ticket.status !== 'PAID') throw requestError(403, 'PAID request');
  if (ticketType.isRemote === true) throw requestError(403, 'Ticket type is remote');
  if (ticketType.includesHotel === false) throw requestError(403, 'Ticket type does not include hotel');

  const room = await bookingRepository.findRoonsById(roomId);
  if (!room) throw notFoundError();
  if (room.Booking.length >= room.capacity) throw requestError(403, 'No vacancies');

  const booking = await bookingRepository.createBookingByRoomId(userId, roomId);

  return booking;
}

async function putBookingById(bookingId: number, userId: number, roomId: number) {
  const bookingUser = await bookingRepository.findRoonsFromBookingByUserId(userId);
  if (!bookingUser) throw requestError(403, 'User has no booking');

  const room = await bookingRepository.findRoonsById(roomId);
  if (!room) throw notFoundError();
  if (room.Booking.length >= room.capacity) throw requestError(403, 'No vacancies');

  const booking = await bookingRepository.updateBookingFromUserByRoomId(bookingUser.id, roomId);

  return booking;
}

const hotelsService = {
  getInfoBooking,
  putBookingById,
  postNewBooking,
};

export default hotelsService;
