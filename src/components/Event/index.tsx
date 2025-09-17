import { Carousel } from 'react-responsive-carousel';
import { BackCircle, CancelIcon, NextCircle } from '@/assets/svg';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './index.css';
import Button from '@/components/Button';

interface PopupModalProps {
  open: boolean;
  onClose: () => void;
}

const Event = ({ open, onClose }: PopupModalProps) => {
  return (
    open && (
      <div
        className="fixed top-0 left-0 z-999 flex h-screen w-screen items-center justify-center bg-[#0000005e]"
        onClick={onClose}
      >
        <div
          className="flex h-200 w-160 flex-col justify-between rounded-[1.25rem] bg-white p-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex w-full justify-between">
            <h1 className="font-apple text-[1.7rem] font-semibold">듀팅 고객 이벤트 (~11.21)</h1>
            <CancelIcon className="h-8 w-8 cursor-pointer" onClick={onClose} />
          </div>
          <div className="mt-4 w-full flex-1">
            <Carousel
              dynamicHeight
              width="100%"
              autoPlay
              infiniteLoop
              stopOnHover
              showArrows
              interval={3000}
              showIndicators={false}
              showThumbs={false}
              statusFormatter={(current, total) => `${current} / ${total}`}
              renderArrowPrev={(click) => (
                <BackCircle
                  className="absolute top-[50%] left-4 z-10 h-12 w-12 translate-y-[-50%] cursor-pointer"
                  onClick={click}
                />
              )}
              renderArrowNext={(click) => (
                <NextCircle
                  className="absolute top-[50%] right-4 z-10 h-12 w-12 translate-y-[-50%] cursor-pointer"
                  onClick={click}
                />
              )}
            >
              <div className='h-140 w-140 min-w-[.0625rem] bg-[url("/img/event1.webp")] bg-cover bg-center'></div>
              <div className='h-140 w-140 min-w-[.0625rem] bg-[url("/img/event2.webp")] bg-cover bg-center'></div>
              <div className='h-140 w-140 min-w-[.0625rem] bg-[url("/img/event3.webp")] bg-cover bg-center'></div>
            </Carousel>
          </div>
          <a href="https://abr.ge/twsrzwm" target="_blank" className="w-full" rel="noreferrer">
            <Button
              className="hover:bg-main-1 mt-auto w-full rounded-lg py-[.5rem] text-[1.8rem] transition-all hover:text-white"
              type="outline"
            >
              이벤트 참여하기
            </Button>
          </a>
        </div>
      </div>
    )
  );
};

export default Event;
