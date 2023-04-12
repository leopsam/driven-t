/*
import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import { invalidDataError, notFoundError } from '@/errors';
import addressRepository, { CreateAddressParams } from '@/repositories/address-repository';
import enrollmentRepository, { CreateEnrollmentParams } from '@/repositories/enrollment-repository';
import { exclude } from '@/utils/prisma-utils';
import { AddressEnrollment } from '@/protocols';
*/

async function getAllTicketsByType() {
  const testoTeste = 'service';
  return testoTeste;
}

async function getAllTickets() {
  const testoTeste = 'service';
  return testoTeste;
}

function postNewTicket() {
  const testoTeste = 'service';
  return testoTeste;
}

const ticketsService = {
  getAllTicketsByType,
  getAllTickets,
  postNewTicket,
};

export default ticketsService;
