import { ExitIcon } from '@assets/svg';
import { SetDivision, SetStraight } from '@components/Settings';
import 'index.css';
import { useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useWardStore } from 'stores/wardStore';

interface Props {
  current: '숙련도' | '연속근무';
  close: () => void;
}

const Modal = ({ current, close }: Props) => {
  const ward = useWardStore();
  const [tempWard, setTempWard] = useState(ward);
  const ref = useOnclickOutside(() => {
    close();
  });

  const handleClickSaveButton = () => {
    ward.setWard(tempWard);
    close();
  };

  let contents: JSX.Element;
  if (current === '숙련도')
    contents = (
      <SetDivision.Contents
        levelDivistion={tempWard.levelDivision}
        setLevelDivision={(level) => setTempWard((prev) => ({ ...prev, levelDivision: level }))}
      />
    );
  else
    contents = (
      <SetStraight.Contents
        maxContinuousWork={tempWard.maxContinuosWork}
        maxContinuousNight={tempWard.maxContinuosNight}
        minNightInterval={tempWard.minNightInterval}
        setMaxContinuousWork={(count) =>
          setTempWard((prev) => ({ ...prev, maxContinuosWork: count }))
        }
        setMaxContinuousNight={(count) =>
          setTempWard((prev) => ({ ...prev, maxContinuosNight: count }))
        }
        setMinNightInterval={(count) =>
          setTempWard((prev) => ({ ...prev, minNightInterval: count }))
        }
      />
    );
  return (
    <div
      ref={ref}
      className="absolute left-[50%] top-[50%] z-30 h-auto min-h-[22rem] w-[80%] shrink-0 translate-x-[-50%] translate-y-[-50%] rounded-[1.25rem] bg-white"
    >
      <ExitIcon
        onClick={close}
        className="absolute right-[1.25rem] top-[1.25rem] h-[1.875rem] w-[1.875rem] cursor-pointer"
      />
      <div className="absolute h-full w-full">{contents}</div>
      <div
        className="absolute bottom-[1.25rem] right-[1.25rem] cursor-pointer rounded-[3.125rem] border border-main-1 px-[1.25rem] py-[.375rem] font-apple text-[1.25rem] font-medium text-main-1"
        onClick={handleClickSaveButton}
      >
        저장
      </div>
    </div>
  );
};

export default Modal;
