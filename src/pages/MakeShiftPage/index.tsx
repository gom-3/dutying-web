import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import ShiftCalendar from './components/ShiftCalendar';
import MakeShiftPageViewModel from './index.viewmodel';
import Panel from './components/Panel';

const MakeShiftPage = () => {
  const {
    state: { shift, focus, foldedLevels, changeStatus, faults, histories },
    actions: { changeFocus, foldLevel },
  } = MakeShiftPageViewModel();

  return shift ? (
    <div className="mx-auto flex h-screen w-fit flex-col overflow-hidden">
      <Toolbar shift={shift} changeStatus={changeStatus} />
      <ShiftCalendar
        shift={shift}
        faults={faults}
        focus={focus}
        foldedLevels={foldedLevels}
        handleFocusChange={changeFocus}
        handleFold={foldLevel}
        isEditable
      />
      <div className="sticky bottom-0 flex h-[15.625rem] justify-end gap-[1.25rem] bg-[#FDFCFE]">
        <CountDutyByDay focus={focus} shift={shift} />
        <Panel histories={histories} faults={faults} />
      </div>
    </div>
  ) : null;
};

export default MakeShiftPage;
