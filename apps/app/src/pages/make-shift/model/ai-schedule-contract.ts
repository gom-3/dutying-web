import type {TAiScheduleResponse} from '@dutying/api/ward';
import type {TDutyDoc} from '@/features/shift-editor';

export type TAiScheduleRequest = {
    shiftTeamId: number;
    year: number;
    month: number;
    doc: TDutyDoc;
};

export type TAiScheduleProvider = {
    generate: (request: TAiScheduleRequest) => Promise<TAiScheduleResponse>;
};

export type TAiScheduleResult =
    | {
          ok: true;
          response: TAiScheduleResponse;
      }
    | {
          ok: false;
          message: string;
      };
