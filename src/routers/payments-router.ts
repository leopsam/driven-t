import { Router } from 'express';
//import { authenticateToken } from '@/middlewares';
import { getEnrollmentByUser, getAddressFromCEP } from '@/controllers';

const paymentsRouter = Router();

// eslint-disable-next-line prettier/prettier
paymentsRouter
  //.all('/*', authenticateToken)
  .get('/:ticketId', getAddressFromCEP)
  .post('/process', getEnrollmentByUser);

export { paymentsRouter };
