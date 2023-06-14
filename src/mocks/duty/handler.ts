import { rest } from 'msw';
import * as service from './service';

export const diaryHandlers = [rest.get('/duty', service.getDuty)];
