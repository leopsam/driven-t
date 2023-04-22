import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getInfoAllHotels, getInfoHotelById } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getInfoAllHotels).get('/:hotelId', getInfoHotelById);

export { hotelsRouter };
