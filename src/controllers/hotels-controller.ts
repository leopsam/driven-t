import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getInfoAllHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const roons = await hotelsService.getAllInfoHotels(Number(userId));
    if (!roons) return res.sendStatus(httpStatus.BAD_REQUEST);

    return res.status(httpStatus.OK).send(roons);
  } catch (e) {
    if (e.name === 'NoContent') return res.sendStatus(httpStatus.NO_CONTENT);
    if (e.name === 'InvalidDataError') return res.status(httpStatus.BAD_REQUEST).send(e.message);
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (e.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (e.name === 'RequestError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED).send(e.statusText);
    //return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export async function getInfoHotelById(req: AuthenticatedRequest, res: Response) {
  try {
    const { hotelId } = req.params;
    const { userId } = req;

    const roons = await hotelsService.getInfoHotelById(Number(hotelId), Number(userId));
    if (!roons) return res.sendStatus(httpStatus.BAD_REQUEST);

    return res.status(httpStatus.OK).send(roons);
  } catch (e) {
    if (e.name === 'NoContent') return res.sendStatus(httpStatus.NO_CONTENT);
    if (e.name === 'InvalidDataError') return res.status(httpStatus.BAD_REQUEST).send(e.message);
    if (e.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (e.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (e.name === 'RequestError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED).send(e.statusText);
    //return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
