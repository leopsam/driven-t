import Joi from 'joi';

export const createTicketSchema = Joi.object({
  ticketTypeId: Joi.number().required(),
});

export const createTicketTypeByEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
