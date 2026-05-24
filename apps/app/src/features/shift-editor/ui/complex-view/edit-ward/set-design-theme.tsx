import useUIConfigUseCase from '@/entities/ui/useUIConfig';
import {useUIConfigStore} from '@/entities/ui/useUIConfig/store';
import Toggle from '@/shared/ui/Toggle';

const SetDesignTheme = () => {
    const separateWeekendColor = useUIConfigStore((state) => state.separateWeekendColor);
    const shiftTypeColorStyle = useUIConfigStore((state) => state.shiftTypeColorStyle);
    const {handleChangeSeparateWeekendColor, handleShiftTypeColorStyle} = useUIConfigUseCase();

    return (
        <div className="flex w-145 flex-col">
            <div className="flex h-18.5 items-center border-b-[.0313rem] border-sub-4.5 px-10 last:border-none">
                <p className="font-apple text-[1.25rem] text-sub-1">토/일 배경색 구분</p>
                <div className="ml-auto flex w-30.25 cursor-pointer items-center justify-between">
                    <Toggle
                        isOn={separateWeekendColor}
                        setIsOn={() => {
                            handleChangeSeparateWeekendColor(separateWeekendColor ? false : true);
                        }}
                    />
                    {separateWeekendColor ? (
                        <p className="flex-1 text-center text-[.75rem] text-sub-3">근무표 적용</p>
                    ) : (
                        <p className="flex-1 text-center text-[.75rem] text-sub-3">근무표 미적용</p>
                    )}
                </div>
            </div>
            <div className="border-bg flex h-18.5 items-center border-b-[.0313rem] px-10 last:border-none">
                <p className="font-apple text-[1.25rem] text-sub-1">근무 유형 표시 스타일</p>
                <div className="bg-bg ml-auto flex h-11 w-32 cursor-pointer justify-between gap-[.25rem] rounded-[.3125rem] border-[.0625rem] border-main-4 p-[.25rem]">
                    <div
                        className={`flex flex-1 items-center justify-center rounded-[.3125rem] font-apple text-[1.25rem] font-medium ${
                            shiftTypeColorStyle === 'background'
                                ? 'bg-sub-3 text-white'
                                : 'border-[.0625rem] border-sub-4.5 bg-white text-sub-3'
                        }`}
                        onClick={() => handleShiftTypeColorStyle('background')}
                    >
                        배경
                    </div>
                    <div
                        className={`flex flex-1 items-center justify-center rounded-[.3125rem] font-apple text-[1.25rem] font-medium ${
                            shiftTypeColorStyle === 'text' ? 'bg-sub-3 text-white' : 'border-[.0625rem] border-sub-4.5 bg-white text-sub-3'
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
