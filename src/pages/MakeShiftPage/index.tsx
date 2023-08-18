import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import ShiftCalendar from './components/ShiftCalendar';
import Panel from './components/Panel';
import { useState } from 'react';
import useEditShift from '@hooks/useEditShift';
import EditNurseTab from './components/editNurse/EditNurseTab';

const MakeShiftPage = () => {
  const {
    state: { shiftStatus },
  } = useEditShift(true);
  const [isNurseTabOpen, setIsNurseTabOpen] = useState(false);

  return shiftStatus === 'success' ? (
    <div className="mx-auto flex h-screen w-fit min-w-[104.625rem] flex-col overflow-hidden">
      <Toolbar />
      <ShiftCalendar isEditable setNurseTabOpen={setIsNurseTabOpen} />
      <div className="sticky bottom-0 z-20 flex h-[15.625rem] w-full gap-[1.25rem] bg-[#FDFCFE] pl-[15.9375rem]">
        <CountDutyByDay />
        <Panel />
      </div>
      {isNurseTabOpen && <EditNurseTab close={() => setIsNurseTabOpen(false)} isFixed />}
    </div>
  ) : null;
};

export default MakeShiftPage;
