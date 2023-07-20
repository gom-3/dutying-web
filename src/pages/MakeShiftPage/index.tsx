import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import ShiftCalendar from './components/ShiftCalendar';
import Panel from './components/Panel';
import useMakeShiftPageHook from './index.hook';

const MakeShiftPage = () => {
  const {
    state: { month, shift, focus, foldedLevels, changeStatus, faults, histories },
    actions: { changeFocus, foldLevel, changeMonth },
  } = useMakeShiftPageHook();

  return shift ? (
    <div className="mx-auto flex h-screen w-fit flex-col overflow-hidden">
      <Toolbar month={month} shift={shift} changeStatus={changeStatus} changeMonth={changeMonth} />
      <ShiftCalendar
        month={month}
        shift={shift}
        faults={faults}
        focus={focus}
        foldedLevels={foldedLevels}
        changeFocus={changeFocus}
        foldLevel={foldLevel}
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
