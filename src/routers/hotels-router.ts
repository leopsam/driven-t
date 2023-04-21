import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getInfoAllHotelsOrHotelById } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getInfoAllHotelsOrHotelById);

export { hotelsRouter };
