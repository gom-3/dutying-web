import { rest } from 'msw';
import { duty } from './data';

export const getDuty: Parameters<typeof rest.get>[1] = (_req, res, ctx) => {
  return res(ctx.status(200), ctx.delay(200), ctx.json(duty));
};
