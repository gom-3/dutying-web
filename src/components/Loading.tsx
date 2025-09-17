import Lottie from 'react-lottie';
import useLoading from '@/hooks/ui/useLoading';
import loadingLottie from '../assets/animation/loading.json';

const Loading = () => {
  const { loading } = useLoading();

  return (
    loading && (
      <div className="fixed z-1005 flex h-screen w-screen items-center justify-center bg-[#0000006e] backdrop-blur-[1px]">
        <Lottie
          options={{
            autoplay: true,
            loop: true,
            animationData: loadingLottie,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice',
            },
          }}
          height={400}
          width={400}
        />
      </div>
    )
  );
};

export default Loading;
