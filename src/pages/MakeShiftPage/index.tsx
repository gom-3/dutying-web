import Toolbar from './components/Toolbar';
import CountDutyByDay from './components/CountDutyByDay';
import ShiftCalendar from './components/ShiftCalendar';
import MakeShiftPageViewModel from './index.viewmodel';
import { match } from 'ts-pattern';

const MakeShiftPage = () => {
  const {
    state: { shift, focus, foldedLevels, changeStatus, shiftStatus, histories },
    actions: { changeFocus, foldLevel },
  } = MakeShiftPageViewModel();

  return shiftStatus === 'success' ? (
    <div className="mx-auto flex h-screen w-fit flex-col overflow-hidden">
      <Toolbar shift={shift} changeStatus={changeStatus} />
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
        <div className="mb-[3.125rem] mt-[1.25rem] w-[13.625rem] rounded-[1.25rem] bg-main-4 px-[1.5625rem] shadow-[0rem_-0.25rem_2.125rem_0rem_#EDE9F5]">
          {histories.map((history, index) => (
            <div key={index}>
              {match(history)
                .with({ prevShiftType: null }, () => (
                  <p>추가 → {history.nextShiftType?.shortName}</p>
                ))
                .with({ nextShiftType: null }, () => (
                  <p>{history.prevShiftType?.shortName} → 삭제</p>
                ))
                .otherwise(() => (
                  <p>
                    {history.prevShiftType?.shortName} → {history.nextShiftType?.shortName}
                  </p>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default MakeShiftPage;
