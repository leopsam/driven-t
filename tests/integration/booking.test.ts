import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createTicketTypeIsRemoteEqualTrue,
  createTicketTypeIncludeHotelEqualFalse,
  createTicketTypeIncludeHotelAndIsRemoteOk,
  createBookingCapacityExceeded,
  createBooking,
  createHotelAndRoons,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const api = supertest(app);

describe('POST /booking', () => {
  it('returns status 401 if no token is provided', async () => {
    const result = await api.post('/bookings');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('returns status 401 when sending invalid token', async () => {
    const token = faker.lorem.word();

    const response = await api.post('/bookings').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when the token is valid', () => {
    it('returns status 403 only for users who do not have a face-to-face ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIsRemoteEqualTrue();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await api.post('/bookings').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('returns status 403 ticket does not have accommodation', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludeHotelEqualFalse();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await api.post('/bookings').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('returns status 403 if the ticket is PAID', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await api.post('/bookings').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('returns status 404 if "roomId" does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludeHotelAndIsRemoteOk();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await api.post('/bookings').set('Authorization', `Bearer ${token}`);

      expect(ticketType.isRemote).toEqual(false);
      expect(ticketType.includesHotel).toEqual(true);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('returns status 403 if "roomId" returns no vacancies', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludeHotelAndIsRemoteOk();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createBookingCapacityExceeded(user.id);

      const response = await api.post('/bookings').set('Authorization', `Bearer ${token}`);

      expect(ticketType.isRemote).toEqual(false);
      expect(ticketType.includesHotel).toEqual(true);
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('returns status 200 when to create booking ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludeHotelAndIsRemoteOk();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const room = await createHotelAndRoons();

      const body = { roomId: room.room.id };

      const response = await api.post(`/bookings`).set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.OK);
    });
  });
});

describe('GET /booking', () => {
  it('returns status 401 if no token is provided', async () => {
    const result = await api.get('/bookings');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('returns status 401 when sending invalid token', async () => {
    const token = faker.lorem.word();

    const response = await api.get('/bookings').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when the token is valid', () => {
    it('returns status 404 user has no booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIsRemoteEqualTrue();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await api.get('/bookings').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('returns status 200 all right, correct body returned', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludeHotelEqualFalse();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createBooking(user.id);

      const response = await api.get('/bookings').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          Room: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            capacity: expect.any(Number),
            hotelId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        }),
      );
    });
  });
});

describe('PUT /booking', () => {
  it('returns status 401 if no token is provided', async () => {
    const result = await api.put('/bookings/1');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('returns status 401 when sending invalid token', async () => {
    const token = faker.lorem.word();

    const response = await api.put('/bookings/0').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when the token is valid', () => {
    it('returns status 403 if user has no booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await api.put(`/bookings/${user.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('returns status 404 if "roomId" does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const booking = await createBooking(user.id);
      const body = { roomId: booking.roomId + 10 };

      const response = await api.put(`/bookings/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('returns status 403 if there are no vacancies', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const booking = await createBookingCapacityExceeded(user.id);
      const body = { roomId: booking.roomId };

      const response = await api.put(`/bookings/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('returns status 200 when to update booking ok', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const booking = await createBooking(user.id);
      const body = { roomId: booking.roomId };

      const response = await api.put(`/bookings/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.OK);
    });
  });
});
