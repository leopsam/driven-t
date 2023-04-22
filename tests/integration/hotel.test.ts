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
  createHotelAndRooms,
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

describe('GET /hotels', () => {
  it('returns status 401 if no token is provided', async () => {
    const result = await api.get('/hotels');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('returns status 401 when sending invalid token', async () => {
    const token = faker.lorem.word();

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when the token is valid', () => {
    it('returns status 404 if subscription does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('returns status 404 if ticket does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('returns status 402 if ticket has not been paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('returns status 402 if ticket type is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIsRemoteEqualTrue();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(ticketType.isRemote).toEqual(true);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('returns status 402 if ticket type does not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludeHotelEqualFalse();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('returns status 404 if there are no hotels', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludeHotelAndIsRemoteOk();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('returns status to list of available hotels', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludeHotelAndIsRemoteOk();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotelAndRooms();

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('returns status 401 if no token is provided', async () => {
    const result = await api.get('/hotels/1');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('returns status 401 when sending invalid token', async () => {
    const token = faker.lorem.word();

    const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when the token is valid', () => {
    it('returns status 404 if subscription does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('returns status 404 if ticket does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('returns status 402 if ticket has not been paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('returns status 402 if ticket type is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIsRemoteEqualTrue();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(ticketType.isRemote).toEqual(true);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('returns status 402 if ticket type does not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludeHotelEqualFalse();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('returns status 404 if hotel does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludeHotelAndIsRemoteOk();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      await createHotelAndRooms();

      const response = await api.get(`/hotels/0`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('returns the hotel with list of rooms', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludeHotelAndIsRemoteOk();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotelAndRooms();

      const response = await api.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          Rooms: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              capacity: expect.any(Number),
              hotelId: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
        }),
      );
    });
  });
});
