import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import ShiftCalendar from './components/ShiftCalendar';
import Panel from './components/Panel';
import useEditShift from '@hooks/shift/useEditShift';
import NurseEditModal from './components/NurseEditModal';

const MakeShiftPage = () => {
  const {
    state: { shift },
  } = useEditShift(true);
  return (
    <div className="mx-auto flex h-screen w-fit min-w-[104.625rem] flex-col">
      <Toolbar />
      <ShiftCalendar />
      <div
        className="sticky bottom-0 z-20 flex items-stretch gap-[1.25rem] bg-main-bg py-[1.25rem] pl-[15.9375rem]"
        style={{
          height: shift
            ? `${shift.wardShiftTypes.filter((x) => x.isCounted).length * 2.5 + 2.5}rem`
            : '0',
        }}
      >
        <CountDutyByDay />
        <Panel />
      </div>
      <NurseEditModal />
    </div>
  );
};

export default MakeShiftPage;
