import DutyCalendar from '@components/DutyCalendar';
import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import CountDutyByNurse from './components/CountDutyByNurse';
import useEditDuty from '@libs/hook/useEditDuty';

const MakeDutyPage = () => {
  const { duty, focus, focusedDayInfo, shiftList, focusedCellRef, handlers } = useEditDuty();

  return (
    <div className="w-full flex-col items-center">
      <Toolbar
        shiftList={shiftList}
        focusedDayInfo={focusedDayInfo}
        handleFocusedDutyChange={handlers.handleFocusedDutyChange}
      />
      <div className="flex">
        <DutyCalendar
          duty={duty}
          shiftList={shiftList}
          isEditable
          focus={focus}
          focusedCellRef={focusedCellRef}
          handleFocusChange={handlers.handleFocusChange}
        />
        <CountDutyByNurse shiftList={shiftList} duty={duty} />
      </div>
      <div className="sticky bottom-0 flex bg-white">
        <CountDutyByDay duty={duty} shiftList={shiftList} />
        <div className="w-[13.5rem]"></div>
      </div>
    </div>
  );
};

export default MakeDutyPage;
