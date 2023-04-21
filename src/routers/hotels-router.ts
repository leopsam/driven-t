import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getInfoAllHotels, getInfoHotelById } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

// eslint-disable-next-line prettier/prettier
hotelsRouter
  .all('/*', authenticateToken)
  .get('/', getInfoAllHotels)
  .get('/:hotelId', getInfoHotelById);

export { hotelsRouter };
