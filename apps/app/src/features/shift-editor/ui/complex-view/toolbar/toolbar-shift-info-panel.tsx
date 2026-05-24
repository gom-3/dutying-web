import {createPortal} from 'react-dom';
import Draggable from 'react-draggable';
import {type TShift} from '@/entities';
import ShiftBadge from '@/entities/shift/ui/shift-badge';
import {CancelIcon} from '@/shared/assets/svg';

type TToolbarShiftInfoPanelProps = {
    shift: TShift | null;
    open: boolean;
    onClose: () => void;
};

export function ToolbarShiftInfoPanel({shift, open, onClose}: TToolbarShiftInfoPanelProps) {
    if (!open) return null;

    return createPortal(
        <Draggable>
            <div className="absolute top-22 left-70.5 z-1001 flex w-116.5 flex-col rounded-[.625rem] bg-white shadow-shadow-3">
                <div className="flex h-6.5 cursor-move items-center rounded-t-[.625rem] bg-sub-5 pl-10">
                    <p className="bottom-0 font-apple text-[.875rem] text-sub-2.5">근무 유형 보기</p>
                    <CancelIcon className="absolute right-[.5rem] h-4.5 w-4.5 cursor-pointer" onClick={onClose} />
                </div>
                <div className="flex flex-wrap items-center justify-start gap-5 py-[.875rem] pl-10">
                    {shift?.wardShiftTypes.map((shiftType, index) => (
                        <div key={index} className="flex shrink-0 items-center gap-[.3125rem]">
                            <ShiftBadge shiftType={shiftType} />
                            <p className="font-apple text-[.875rem] text-sub-2">
                                {shiftType.name}({shiftType.shortName})
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Draggable>,
        document.getElementById('info-modal-root')!,
    );
}
