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
  user: {
    id: number;
    name: string;
    hospitalInfo: Hospital;
  };
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

export const useUserLoggedIn = () => useUserStore((state) => state.isLoggedIn);
export const useUserInfo = () => useUserStore((state) => state.user);
export const useUserAction = () => useUserStore((state) => state.action);
