import { ExitIcon } from '@assets/svg';
import { SetDivision, SetStraight } from '@components/Settings';
import { EditWardRequest, WardResponse } from '@libs/api/ward';
import 'index.css';
import { useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';

interface Props {
  current: '숙련도' | '연속근무';
  close: () => void;
  ward: WardResponse;
  edit: (wardId: number, editWardDTO: EditWardRequest) => void;
}

const Modal = ({ current, close, ward, edit }: Props) => {
  const [tempWard, setTempWard] = useState(ward);
  const [tempDTO, setTempDTO] = useState<EditWardRequest>();

  const ref = useOnclickOutside(() => {
    close();
  });

  const handleClickSaveButton = () => {
    if (tempDTO) edit(ward.wardId, tempDTO);
    close();
  };

  const setLevelDivision = (level: number) => {
    setTempWard((prev) => ({ ...prev, levelDivision: level }));
    setTempDTO({ levelDivision: level });
  };

  const setShiftConstraint = (
    type: 'maxContinuousWork' | 'maxContinuousNight' | 'minNightInterval',
    count: number
  ) => {
    setTempWard((prev) => ({ ...prev, [type]: count }));
    setTempDTO((prev) => ({ ...prev, [type]: count }));
  };

  let contents: JSX.Element;
  if (current === '숙련도')
    contents = (
      <SetDivision.Contents
        levelDivistion={tempWard.levelDivision}
        setLevelDivision={setLevelDivision}
      />
    );
  else
    contents = (
      <SetStraight.Contents
        maxContinuousWork={tempWard.maxContinuousWork}
        maxContinuousNight={tempWard.maxContinuousNight}
        minNightInterval={tempWard.minNightInterval}
        setMaxContinuousWork={(count) => setShiftConstraint('maxContinuousWork', count)}
        setMaxContinuousNight={(count) => setShiftConstraint('maxContinuousNight', count)}
        setMinNightInterval={(count) => setShiftConstraint('minNightInterval', count)}
      />
    );
  return (
    <div className="fixed left-0 top-0 z-50 h-screen w-screen bg-[#00000066]">
      <div
        ref={ref}
        className="absolute left-[50%] top-[50%] z-30 h-auto min-h-[22rem] w-[80%] shrink-0 translate-x-[-50%] translate-y-[-50%] rounded-[1.25rem] bg-white"
      >
        <ExitIcon
          onClick={close}
          className="absolute right-[1.25rem] top-[1.25rem] z-40 h-[1.875rem] w-[1.875rem] cursor-pointer"
        />
        <div className="absolute h-full w-full">{contents}</div>
        <div
          className="absolute bottom-[1.25rem] right-[1.25rem] cursor-pointer rounded-[3.125rem] border border-main-1 px-[1.25rem] py-[.375rem] font-apple text-[1.25rem] font-medium text-main-1"
          onClick={handleClickSaveButton}
        >
          저장
        </div>
      </div>
    </div>
  );
};

export default Modal;
