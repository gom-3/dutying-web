import Toggle from '@/components/Toggle';
import useUIConfig from '@/hooks/ui/useUIConfig';

const SetDesignTheme = () => {
  const {
    state: { separateWeekendColor, shiftTypeColorStyle },
    actions: { handleChangeSeparateWeekendColor, handleShiftTypeColorStyle },
  } = useUIConfig();

  return (
    <div className="flex w-145 flex-col">
      <div className="border-sub-4.5 flex h-18.5 items-center border-b-[.0313rem] px-10 last:border-none">
        <p className="font-apple text-sub-1 text-[1.25rem]">토/일 배경색 구분</p>
        <div className="ml-auto flex w-30.25 cursor-pointer items-center justify-between">
          <Toggle
            isOn={separateWeekendColor}
            setIsOn={() => {
              handleChangeSeparateWeekendColor(separateWeekendColor ? false : true);
            }}
          />
          {separateWeekendColor ? (
            <p className="text-sub-3 flex-1 text-center text-[.75rem]">근무표 적용</p>
          ) : (
            <p className="text-sub-3 flex-1 text-center text-[.75rem]">근무표 미적용</p>
          )}
        </div>
      </div>
      <div className="border-bg flex h-18.5 items-center border-b-[.0313rem] px-10 last:border-none">
        <p className="font-apple text-sub-1 text-[1.25rem]">근무 유형 표시 스타일</p>
        <div className="bg-bg border-main-4 ml-auto flex h-11 w-32 cursor-pointer justify-between gap-[.25rem] rounded-[.3125rem] border-[.0625rem] p-[.25rem]">
          <div
            className={`font-apple flex flex-1 items-center justify-center rounded-[.3125rem] text-[1.25rem] font-medium ${
              shiftTypeColorStyle === 'background'
                ? 'bg-sub-3 text-white'
                : 'border-sub-4.5 text-sub-3 border-[.0625rem] bg-white'
            }`}
            onClick={() => handleShiftTypeColorStyle('background')}
          >
            배경
          </div>
          <div
            className={`font-apple flex flex-1 items-center justify-center rounded-[.3125rem] text-[1.25rem] font-medium ${
              shiftTypeColorStyle === 'text'
                ? 'bg-sub-3 text-white'
                : 'border-sub-4.5 text-sub-3 border-[.0625rem] bg-white'
            }`}
            onClick={() => handleShiftTypeColorStyle('text')}
          >
            글자
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetDesignTheme;
