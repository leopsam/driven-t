/*
import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import { invalidDataError, notFoundError } from '@/errors';
import addressRepository, { CreateAddressParams } from '@/repositories/address-repository';
import enrollmentRepository, { CreateEnrollmentParams } from '@/repositories/enrollment-repository';
import { exclude } from '@/utils/prisma-utils';
import { AddressEnrollment } from '@/protocols';
*/

import ticketRepository from '@/repositories/ticket-repository';

async function getAllTicketsByType() {
  const ticketsTypes = await ticketRepository.findManyTicketType();
  return ticketsTypes;
}

async function getAllTickets() {
  const tickets = await ticketRepository.findManyTickets();
  return tickets;
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
