import supertest from 'supertest';
import httpStatus from 'http-status';
//import { Enrollment } from '@prisma/client';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createTicketTypeIsRemoteEqualTrue,
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
//const newDate = new Date()

describe('GET /hotels', () => {
  it('retorna status 401 se nenhum token for fornecido', async () => {
    /*const body: Enrollment = {
      id: 1,
      name: 'Teste da Silva',
      cpf: '12345678914',
      birthday: newDate,
      phone: '(21)97777-7777',
      userId: 1,
      createdAt: newDate,
      updatedAt: newDate,
    };*/

    const result = await api.get('/hotels');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('retorna status 401 ao enviar token invalido', async () => {
    const token = faker.lorem.word();

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('quando o token é válido', () => {
    it('retorna status 404 se inscrição não existir', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('retorna status 404 se ticket não existir', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('retorna status 402 se ticket não foi pago', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('retorna status 402 se o tipo do ticket for remoto', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIsRemoteEqualTrue();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      ticketType.isRemote;

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(ticketType.isRemote).toEqual(true);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('retorna status 402 se o tipo do ticket for remoto', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      ticketType.includesHotel;

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
  });
});
