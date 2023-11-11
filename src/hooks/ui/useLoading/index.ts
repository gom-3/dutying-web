import { shallow } from 'zustand/shallow';
import { useLoadingStore } from './store';

const useLoading = () => {
  const [loading, setState] = useLoadingStore((state) => [state.loading, state.setState], shallow);

  return {
    loading,
    setLoading: (loading: boolean) => setState('loading', loading),
  };
};

export default useLoading;
