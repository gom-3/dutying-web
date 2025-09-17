import { setAccessToken } from '@/libs/api/client';
import useAuthStore from './auth/useAuth/store';
import useEditShiftStore from './shift/useEditShift/store';
import { useRequestShiftStore } from './shift/useRequestShift/store';

const useInitStore = () => {
  const { initState: initReqShiftStore } = useRequestShiftStore();
  const { initState: initShiftStore } = useEditShiftStore();
  const { initState: initAuthStore } = useAuthStore();
  const initStore = () => {
    initReqShiftStore();
    initShiftStore();
    initAuthStore();
    setAccessToken('');
  };

  return initStore;
};

export default useInitStore;
