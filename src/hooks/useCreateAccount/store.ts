import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  account: CreateAccountRequestDTO;
  isFilled: boolean;
  error: CreateAccountRequestDTOValidationError;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

const initialState: State = {
  account: {
    name: '',
    gender: '여',
    birthday: '',
    phoneNum: '',
    employmentDate: '',
    isWorker: true,
  },
  isFilled: false,
  error: null,
};

const useCreateAccountStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setState: (key, value) =>
          set(
            produce(get(), (draft) => {
              const a = draft[key];
              draft[key] = value;
            })
          ),
      }),
      {
        name: 'useCreateAccountStore',
      }
    )
  )
);

export default useCreateAccountStore;
