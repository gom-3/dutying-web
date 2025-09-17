import { useLoadingStore } from './store';

const useLoading = () => {
  const { loading, setState } = useLoadingStore();

  return {
    loading,
    setLoading: (loading: boolean) => setState('loading', loading),
  };
};

export default useLoading;
