import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import ShiftCalendar from './components/ShiftCalendar';
import Panel from './components/Panel';
import EditNurseTab from '../MemberPage/RegistMemberPage/components/Editor';
import useRegistNurse from '@pages/MemberPage/RegistMemberPage/useRegistNurse';
import useEditShift from 'hooks/useEditShift';
import { useState } from 'react';

const MakeShiftPage = () => {
  const { nurse, selectNurse, updateNurse, updateNurseShift } = useRegistNurse();
  const {
    state: { shiftStatus },
  } = useEditShift();
  const [isNurseTabOpen, setIsNurseTabOpen] = useState(false);

  return shiftStatus === 'success' ? (
    <div className="mx-auto flex h-screen w-fit min-w-[104.625rem] flex-col overflow-hidden">
      <Toolbar />
      <ShiftCalendar isEditable setNurseTabOpen={setIsNurseTabOpen} selectNurse={selectNurse} />
      <div className="sticky bottom-0 z-20 flex h-[15.625rem] w-full gap-[1.25rem] bg-[#FDFCFE] pl-[6.5rem]">
        <CountDutyByDay />
        <Panel />
      </div>
      {isNurseTabOpen && (
        <EditNurseTab
          close={() => setIsNurseTabOpen(false)}
          nurse={nurse}
          updateNurse={updateNurse}
          updateNurseShift={updateNurseShift}
          isFixed
        />
      )}
    </div>
  ) : null;
};

export default MakeShiftPage;
