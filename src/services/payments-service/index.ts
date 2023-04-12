/*
import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import { invalidDataError, notFoundError } from '@/errors';
import paymentRepository, { CreateAddressParams } from '@/repositories/address-repository';
import ticketRepository, { CreateEnrollmentParams } from '@/repositories/enrollment-repository';
import { exclude } from '@/utils/prisma-utils';
import { AddressEnrollment } from '@/protocols';
*/

async function getInfoPaymentByTicket(): Promise<string> {
  const testoTeste = 'service';
  return testoTeste;
}

async function postPaymentFromTicket(): Promise<string> {
  const testoTeste = 'service';
  return testoTeste;
}

const paymentsService = {
  getInfoPaymentByTicket,
  postPaymentFromTicket,
};

export default paymentsService;
