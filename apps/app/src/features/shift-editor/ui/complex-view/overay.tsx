import {type TWardShiftType} from '@/entities';
import ShiftBadge from '@/entities/shift/ui/shift-badge';

interface ICountByShift {
    count: number;
    shiftType: TWardShiftType;
}

interface IOverayProps {
    countByShiftList: ICountByShift[];
    message: string;
}

function Overay({countByShiftList, message}: IOverayProps) {
    return (
        <div
            className="absolute z-20 flex flex-col items-center"
            style={{
                transform: `translate(-50%)`,
            }}
        >
            <div className="h-4.5 w-[.0625rem] bg-main-1" />
            <div className="flex h-28.75 w-83.25 flex-col justify-between rounded-[.9375rem] border-[.0938rem] border-main-1 bg-[#fffffff2] px-5.25 py-[.875rem] shadow-shadow-2">
                <div className="flex justify-between">
                    {[...countByShiftList.slice(1), countByShiftList[0]].map((item, i) =>
                        item ? (
                            <div key={i} className="flex h-13.25">
                                <p className="font-poppins text-[.75rem] text-sub-2.5">{item.count}</p>
                                <ShiftBadge shiftType={item.shiftType} className="h-10.5 w-10.5 self-end text-[1.875rem]" />
                            </div>
                        ) : null,
                    )}
                </div>
                <p className="text-center font-poppins text-[.75rem] text-main-1">{message}</p>
            </div>
        </div>
    );
}

export default Overay;
