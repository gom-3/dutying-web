import useEditShift from '@/hooks/shift/useEditShift';
import CountDutyByDay from './components/CountDutyByDay';
import NurseEditModal from './components/NurseEditModal';
import Panel from './components/Panel';
import ShiftCalendar from './components/ShiftCalendar';
import Toolbar from './components/Toolbar';

const MakeShiftPage = () => {
  const {
    state: { shift },
  } = useEditShift(true);

  return (
    <div className="mx-auto flex h-screen w-fit min-w-418.5 flex-col">
      <Toolbar />
      <ShiftCalendar />
      <div
        className="bg-main-bg sticky bottom-0 z-20 flex items-stretch gap-5 py-5 pl-63.75"
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
