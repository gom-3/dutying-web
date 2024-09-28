import { Carousel } from 'react-responsive-carousel';
import { BackCircle, CancelIcon, NextCircle } from '@assets/svg';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './index.css';
import Button from '@components/Button';

interface PopupModalProps {
  open: boolean;
  onClose: () => void;
}

const Event = ({ open, onClose }: PopupModalProps) => {
  return (
    open && (
      <div className="fixed left-0 top-0 z-[999] flex h-screen w-screen items-center justify-center bg-[#0000005e]" onClick={onClose}>
        <div className=" flex h-[50rem] w-[40rem] flex-col justify-between rounded-[1.25rem] bg-white p-10" onClick={(e) => e.stopPropagation()}>
          <div className="flex w-full justify-between">
            <h1 className="font-apple text-[1.7rem] font-semibold">듀팅 고객 이벤트 (~11.21)</h1>
            <CancelIcon className="size-8 cursor-pointer" onClick={onClose} />
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
              renderArrowPrev={(click) => <BackCircle className="absolute left-4 top-1/2 z-10 size-12 -translate-y-1/2 cursor-pointer" onClick={click} />}
              renderArrowNext={(click) => <NextCircle className="absolute right-4 top-1/2 z-10 size-12 -translate-y-1/2 cursor-pointer" onClick={click} />}
            >
              <div className='size-[35rem] min-w-[.0625rem] bg-[url("/img/event1.webp")] bg-cover bg-center'></div>
              <div className='size-[35rem] min-w-[.0625rem] bg-[url("/img/event2.webp")] bg-cover bg-center'></div>
              <div className='size-[35rem] min-w-[.0625rem] bg-[url("/img/event3.webp")] bg-cover bg-center'></div>
            </Carousel>
          </div>
          <a href="https://abr.ge/twsrzwm" target="_blank" className="w-full">
            <Button className="mt-auto w-full rounded-lg py-[.5rem] text-[1.8rem] transition-all hover:bg-main-1 hover:text-white" type="outline">
              이벤트 참여하기
            </Button>
          </a>
        </div>
      </div>
    )
  );
};

export default Event;
