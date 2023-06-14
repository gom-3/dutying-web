import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Hospital {
  hospital: string;
  ward: string;
  code: string;
}

interface User {
  id: number;
  name: string;
  hospitalInfo: Hospital;
}

interface UserState {
  isLoggedIn: boolean;
  user: User;
  action: {
    loginUser: (user: User) => void;
    setHospital: (hospital: Hospital) => void;
  };
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        isLoggedIn: false,
        user: {
          id: 0,
          name: '',
          hospitalInfo: {
            hospital: '',
            ward: '',
            code: '',
          },
        },
        action: {
          loginUser: (user) => set(() => ({ isLoggedIn: true, user: user })),
          setHospital: (hospital) =>
            set((state) => ({ user: { ...state.user, hospitalInfo: hospital } })),
        },
      }),
      {
        name: 'user-storage',
      }
    )
  )
);

/**
 * 리렌더링 최적화를 위해 State를 3분류해서 따로 export
 * user에 관련한 새로운 속성이 추가된다면 state.user에 추가
 * 새로운 action(reducer)가 추가된다면 state.action에 추가
 */
export const useUserLoggedIn = () => useUserStore((state) => state.isLoggedIn);
export const useUserInfo = () => useUserStore((state) => state.user);
export const useUserAction = () => useUserStore((state) => state.action);
