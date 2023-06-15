import DutyCalendar from '@components/common/DutyCalendar';
import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import CountDutyByNurse from './components/CountDutyByNurse';
import useEditDuty from '@libs/hook/useEditDuty';

const MakeDutyPage = () => {
  const { duty, focus, shiftKindList, setFocus } = useEditDuty();

  return (
    <div className="w-full flex-col items-center">
      <Toolbar />
      <div className="flex">
        <DutyCalendar
          duty={duty}
          shiftKindList={shiftKindList}
          isEditable
          focus={focus}
          onFocusChange={setFocus}
        />
        <CountDutyByNurse duty={duty} />
      </div>
      <div className="sticky bottom-0 flex bg-white">
        <CountDutyByDay duty={duty} shiftKindList={shiftKindList} />
        <div className="w-[216px]"></div>
      </div>
    </div>
  );
};

export default MakeDutyPage;
