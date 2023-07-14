import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import ShiftCalendar from './components/ShiftCalendar';
import MakeShiftPageViewModel from './index.viewmodel';

const MakeShiftPage = () => {
  const {
    state: { shift, focus, foldedLevels, isLoading },
    actions: { changeFocus, foldLevel },
  } = MakeShiftPageViewModel();

  return (
    <div className="mx-auto flex h-screen w-fit flex-col overflow-hidden">
      <Toolbar shift={shift} isLoading={isLoading} />
      <ShiftCalendar
        shift={shift}
        focus={focus}
        foldedLevels={foldedLevels}
        handleFocusChange={changeFocus}
        handleFold={foldLevel}
        isEditable
      />
      <div className="sticky bottom-0 flex h-[15.625rem] justify-end gap-[1.25rem] bg-[#FDFCFE]">
        {shift && <CountDutyByDay focus={focus} shift={shift} />}
        <div className="mb-[3.125rem] mt-[1.25rem] w-[13.625rem] rounded-[1.25rem] bg-main-4 px-[1.5625rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]"></div>
      </div>
    </div>
  );
};

export default MakeShiftPage;
