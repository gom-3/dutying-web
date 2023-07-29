/* eslint-disable @typescript-eslint/no-unused-vars */
type CreateWardRequestDTO = Pick<
  Ward,
  | 'name'
  | 'nurseCnt'
  | 'maxContinuousNight'
  | 'maxContinuousWork'
  | 'minNightInterval'
  | 'levelDivision'
> & { hospitalName: string };

type CreateWardRequestDTOValidationError = { step: number; message: string } | null;
