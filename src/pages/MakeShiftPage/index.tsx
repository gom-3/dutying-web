import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import ShiftCalendar from './components/ShiftCalendar';
import Panel from './components/Panel';
import useEditShift from '@hooks/shift/useEditShift';
import NurseEditModal from './components/NurseEditModal';

const MakeShiftPage = () => {
  useEditShift(true);
  return (
    <div className="mx-auto flex h-screen w-fit min-w-[104.625rem] flex-col overflow-hidden">
      <Toolbar />
      <ShiftCalendar isEditable />
      <div className="sticky bottom-0 z-20 flex h-[15.625rem] w-full gap-[1.25rem] bg-[#FDFCFE] pl-[15.9375rem]">
        <CountDutyByDay />
        <Panel />
      </div>
      <NurseEditModal />
    </div>
  );
};

export default MakeShiftPage;
