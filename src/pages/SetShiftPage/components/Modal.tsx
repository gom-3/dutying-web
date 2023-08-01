import useOnclickOutside from 'react-cool-onclickoutside';
import SetDivision from './SetDivision';
import SetStraight from './SetStraight';
import { ExitIcon } from '@assets/svg';
import { match } from 'ts-pattern';
import useEditWard from '@hooks/useEditWard';
import { useEffect } from 'react';
import { pick } from 'lodash-es';

interface Props {
  currentModal: '숙련도' | '연속근무';
  closeModal: () => void;
}

const Modal = ({ currentModal, closeModal }: Props) => {
  const {
    state: { tempWard },
    actions: { editWardSetting, synchronizeTempWard },
  } = useEditWard();

  const ref = useOnclickOutside(() => {
    closeModal();
  });

  const handleClickSaveButton = () => {
    if (tempWard)
      editWardSetting(
        pick(tempWard, [
          'name',
          'hospitalName',
          'levelDivision',
          'maxContinuousWork',
          'maxContinuousNight',
          'minNightInterval',
        ])
      );
    closeModal();
  };

  useEffect(() => {
    return () => {
      synchronizeTempWard();
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-screen w-screen bg-[#00000066]">
      <div
        ref={ref}
        className="absolute left-[50%] top-[50%] z-30 h-auto min-h-[22rem] w-[80%] shrink-0 translate-x-[-50%] translate-y-[-50%] rounded-[1.25rem] bg-white"
      >
        <ExitIcon
          onClick={closeModal}
          className="absolute right-[1.25rem] top-[1.25rem] z-40 h-[1.875rem] w-[1.875rem] cursor-pointer"
        />
        <div className="absolute h-full w-full">
          {match(currentModal)
            .with('숙련도', () => <SetDivision />)
            .with('연속근무', () => <SetStraight />)
            .exhaustive()}
        </div>
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
