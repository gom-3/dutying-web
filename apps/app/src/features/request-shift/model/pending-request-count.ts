import {type TDutyRequest} from '@/entities/shift';

export const countPendingDutyRequests = (requests: TDutyRequest[]) => requests.filter((request) => request.isAccepted === null).length;
