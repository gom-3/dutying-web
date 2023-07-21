import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import ShiftCalendar from './components/ShiftCalendar';
import Panel from './components/Panel';
import useMakeShiftPageHook from './index.hook';
import EditNurseTab from '../MemberPage/RegistMemberPage/components/Editor';
import useRegistNurse from '@pages/MemberPage/RegistMemberPage/useRegistNurse';

const MakeShiftPage = () => {
  const {
    state: { month, shift, focus, foldedLevels, changeStatus, faults, histories, isNurseTabOpen },
    actions: { changeFocus, foldLevel, changeMonth, setIsNurseTabOpen },
  } = useMakeShiftPageHook();
  const { nurse, selectNurse, updateNurse, updateNurseShift } = useRegistNurse();
  return shift ? (
    <div className="mx-auto flex h-screen w-fit min-w-[104.625rem] flex-col overflow-hidden">
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
        setNurseTabOpen={setIsNurseTabOpen}
        selectNurse={selectNurse}
      />
      <div className="sticky bottom-0 z-10 flex h-[15.625rem] w-full gap-[1.25rem] bg-[#FDFCFE] pl-[6.5rem]">
        <CountDutyByDay focus={focus} shift={shift} />
        <Panel histories={histories} faults={faults} />
      </div>
      {isNurseTabOpen && (
        <EditNurseTab
          close={() => setIsNurseTabOpen(false)}
          isFixed
          nurse={nurse}
          updateNurse={updateNurse}
          updateNurseShift={updateNurseShift}
        />
      )}
    </div>
  ) : null;
};

export default MakeShiftPage;
