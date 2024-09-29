import { NextIcon, PenIcon, PrevIcon, SaveCompleteIcon, SavingIcon } from '@assets/svg';
import useRequestShift from '@hooks/shift/useRequestShift';
import { events, sendEvent } from 'analytics';
import Button from '@components/Button';
import Select from '@components/Select';

function Toolbar() {
  const {
    state: { month, changeStatus, currentShiftTeam, shiftTeams, readonly },
    actions: { changeMonth, changeShiftTeam, toggleEditMode },
  } = useRequestShift();

  return (
    <div id="toolbar" className="sticky top-0 z-30 flex h-[6.125rem] w-full items-center bg-main-bg pb-[.75rem] pl-5 pr-4 pt-[1.875rem]">
      <div className="flex gap-5">
        <div className="w-[3.375rem]"></div>
        <div className="w-[4.375rem]"></div>
        <div className="w-4"></div>
      </div>

      <div className="absolute flex items-center">
        <PrevIcon
          onClick={() => {
            changeMonth('prev');
            sendEvent(events.requestPage.toolbar.changeMonth);
          }}
          className="size-[1.875rem] cursor-pointer"
        />
        <p className="mx-[.625rem] font-poppins text-2xl text-main-1">{month}월</p>
        <NextIcon
          onClick={() => {
            changeMonth('next');
            sendEvent(events.requestPage.toolbar.changeMonth);
          }}
          className="size-[1.875rem] cursor-pointer"
        />
      </div>

      {!readonly && (
        <>
          <div className="ml-auto flex gap-[.3125rem] font-apple text-[.875rem] text-sub-2.5">
            {changeStatus === 'loading' ? <SavingIcon className="size-5" /> : <SaveCompleteIcon className="size-5" />}
            {changeStatus === 'loading' ? '저장중' : '저장 완료'}
          </div>
        </>
      )}

      <div>
        {currentShiftTeam && (
          <Select
            value={currentShiftTeam?.shiftTeamId}
            options={shiftTeams?.map((shiftTeam) => ({
              label: shiftTeam.name,
              value: shiftTeam.shiftTeamId,
            }))}
            className="ml-[1.875rem] h-[2.875rem] w-[10.5rem] font-apple text-[1.25rem] font-semibold text-main-1"
            selectClassName="outline-[.0938rem] outline-main-1"
            onChange={(e) => {
              changeShiftTeam(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                shiftTeams!.find((shiftTeam) => shiftTeam.shiftTeamId === parseInt(e.target.value))!
              );
              sendEvent(events.requestPage.toolbar.changeShiftTeam);
            }}
          />
        )}
      </div>

      {readonly ? (
        <div className="ml-auto flex gap-[10px]">
          <Button
            id="editButton"
            type="fill"
            className="flex h-10 items-center justify-center gap-[.5rem] rounded-[.625rem] bg-main-2 px-[.75rem] text-[1.25rem] font-semibold"
            onClick={() => toggleEditMode()}
          >
            수정하기
            <PenIcon className="size-6 stroke-white" />
          </Button>
        </div>
      ) : (
        <div className="ml-5 flex gap-[.875rem]">
          <Button type="outline" className="h-10 w-[4.6875rem] rounded-[3.125rem] text-[1.25rem] font-semibold" onClick={() => toggleEditMode()}>
            저장
          </Button>
        </div>
      )}
    </div>
  );
}

export default Toolbar;
