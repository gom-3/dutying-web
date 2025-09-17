import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { type TValues } from '@/types/util';

interface State {
  showMakeTutorial: boolean;
  showRequestTutorial: boolean;
  showMemberTutorial: boolean;
}

interface Store extends State {
  setState: (key: keyof State, value: TValues<State>) => void;
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
      (set) => ({
        ...initialState,
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
        initState: () => set(initialState),
      }),
      {
        name: 'useTutorialStore',
        partialize: ({ showMakeTutorial, showRequestTutorial, showMemberTutorial }: Store) => ({
          showMakeTutorial,
          showRequestTutorial,
          showMemberTutorial,
        }),
      },
    ),
  ),
);
