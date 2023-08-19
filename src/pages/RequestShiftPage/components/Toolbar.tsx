import { NextIcon, PrevIcon, SaveCompleteIcon, SavingIcon } from '@assets/svg';
import Select from '@components/Select';
import useRequestShift from '@hooks/useRequestShift';

function Toolbar() {
  const {
    state: { month, changeStatus, currentShiftTeam, shiftTeams },
    actions: { changeMonth, changeShiftTeam },
  } = useRequestShift();

  return (
    <div className="sticky top-0 z-30 flex h-[6.125rem] w-full items-center bg-[#FDFCFE] pb-[.75rem] pl-[1.25rem] pt-[1.875rem]">
      <div className="flex gap-[1.25rem]">
        <div className="w-[3.375rem]"></div>
        <div className="w-[4.375rem]"></div>
        <div className="w-[1.875rem]"></div>
        <div className="w-[5.625rem]"></div>
      </div>

      <div className="absolute flex items-center">
        <PrevIcon
          onClick={() => changeMonth('prev')}
          className="h-[1.875rem] w-[1.875rem] cursor-pointer"
        />
        <p className="mx-[.625rem] font-poppins text-2xl text-main-1">{month}월</p>
        <NextIcon
          onClick={() => changeMonth('next')}
          className="h-[1.875rem] w-[1.875rem] cursor-pointer"
        />
      </div>

      <div className="ml-auto flex gap-[.3125rem] font-apple text-[.875rem] text-sub-2.5">
        {changeStatus === 'loading' ? (
          <SavingIcon className="h-[1.25rem] w-[1.25rem]" />
        ) : (
          <SaveCompleteIcon className="h-[1.25rem] w-[1.25rem]" />
        )}
        {changeStatus === 'loading' ? '저장중' : '저장 완료'}
      </div>

      <div>
        {currentShiftTeam && (
          <Select
            value={currentShiftTeam?.shiftTeamId}
            options={shiftTeams?.map((shiftTeam) => ({
              label: shiftTeam.name,
              value: shiftTeam.shiftTeamId,
            }))}
            className="ml-[1.875rem] h-[2.875rem] w-[10.5rem] font-apple text-[1.25rem] text-main-1"
            selectClassName="outline-[.0938rem] outline-main-1"
            onChange={(e) =>
              changeShiftTeam(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                shiftTeams!.find((shiftTeam) => shiftTeam.shiftTeamId === parseInt(e.target.value))!
              )
            }
          />
        )}
      </div>
    </div>
  );
}

export default Toolbar;
