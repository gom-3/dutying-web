import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { produce } from 'immer';

interface State {
  showMakeTutorial: boolean;
  showRequestTutorial: boolean;
  showMemberTutorial: boolean;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
  initState: () => void;
}

const initialState: State = {
  showMakeTutorial: true,
  showRequestTutorial: true,
  showMemberTutorial: true,
};

export const useTutorialStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setState: (state, value) =>
          set(
            produce(get(), (draft) => {
              draft[state] = value as never;
            })
          ),
        initState: () => set(initialState),
      }),
      {
        name: 'useTutorialStore',
        partialize: ({ showMakeTutorial, showRequestTutorial, showMemberTutorial }: Store) => ({
          showMakeTutorial,
          showRequestTutorial,
          showMemberTutorial,
        }),
      }
    )
  )
);
