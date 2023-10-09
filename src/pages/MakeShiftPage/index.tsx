import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import ShiftCalendar from './components/ShiftCalendar';
import Panel from './components/Panel';
import useEditShift from '@hooks/shift/useEditShift';
import NurseEditModal from './components/NurseEditModal';

const MakeShiftPage = () => {
  useEditShift(true);
  return (
    <div className="mx-auto flex h-screen w-fit min-w-[104.625rem] flex-col">
      <Toolbar />
      <ShiftCalendar />
      <div className="relative mt-[1.25rem] flex w-full justify-between bg-[#FDFCFE] pl-[15.9375rem]">
        <CountDutyByDay />
        <Panel />
      </div>
      <NurseEditModal />
    </div>
  );
};

export default MakeShiftPage;
