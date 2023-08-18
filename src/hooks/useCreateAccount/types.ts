/* eslint-disable @typescript-eslint/no-unused-vars */
type CreateAccountRequestDTOValidationError = {
  key: keyof CreateAccountRequestDTO;
  message: string;
} | null;

type CreateAccountRequestDTO = Pick<Account, 'name' | 'gender' | 'phoneNum'>;
