import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import useEditDuty from '@pages/MakeDutyPage/components/useEditDuty';
import DutyCalendar from './components/DutyCalendar';

const MakeDutyPage = () => {
  const { duty, focus, rowContainerRef, foldedProficiency, shiftList, focusedCellRef, handlers } =
    useEditDuty();

  return (
    <div className="mx-auto flex h-screen w-fit flex-col overflow-hidden">
      <Toolbar duty={duty} />
      <DutyCalendar
        duty={duty}
        shiftList={shiftList}
        isEditable
        focus={focus}
        foldedProficiency={foldedProficiency}
        focusedCellRef={focusedCellRef}
        rowContainerRef={rowContainerRef}
        handleFocusChange={handlers.handleFocusChange}
        handleFold={handlers.handleFold}
      />
      <div className="sticky bottom-0 flex h-[15.625rem] justify-end gap-[1.25rem] bg-[#FDFCFE]">
        <CountDutyByDay focus={focus} duty={duty} shiftList={shiftList} />
        <div className="mb-[3.125rem] mt-[1.25rem] w-[13.625rem] rounded-[1.25rem] bg-main-4 px-[1.5625rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]"></div>
      </div>
    </div>
  );
};

export default MakeDutyPage;
