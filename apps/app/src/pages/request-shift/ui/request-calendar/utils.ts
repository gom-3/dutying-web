import {type DropResult} from '@hello-pangea/dnd';
import {type TDutyRequest, type TRequestShift} from '@/entities/shift';
import {type TShiftTeam, type TWardShiftType} from '@/entities/ward';
import {type TFocus} from '@/features/request-shift/model/types';
import i18n from '@/i18n';

const PRIORITY_GAP = 2024;

export const getYearMonthLabel = (year: number, month: number) => `${year}-${month.toString().padStart(2, '0')}`;

export const getDutyRequestLookupKey = (nurseId: number, dateIndex: number) => `${nurseId}:${dateIndex}`;

export const createDutyRequestLookup = (dutyRequestList: TDutyRequest[] | undefined) =>
    new Map(dutyRequestList?.map((request) => [getDutyRequestLookupKey(request.nurseId, request.date - 1), request]) ?? []);

export const createShiftNurseIdByNurseId = (requestShift: TRequestShift) =>
    new Map(
        requestShift.divisionShiftNurses
            .flatMap((division) => division)
            .map((row) => [row.shiftNurse.nurseId, row.shiftNurse.shiftNurseId]),
    );

export const createConnectedNurseIdSet = (currentShiftTeam: TShiftTeam) =>
    new Set(currentShiftTeam.nurses.filter((nurse) => nurse.isConnected).map((nurse) => nurse.nurseId));

export const getDutyRequestStatusLabel = (isAccepted: boolean | null) => {
    if (isAccepted === true) return i18n.t('page.request.calendar.status.accepted');

    if (isAccepted === false) return i18n.t('page.request.calendar.status.rejected');

    return i18n.t('page.request.calendar.status.pending');
};

export const getDutyRequestStatusDescription = ({
    isAccepted,
    readonly,
    requestFocus,
}: {
    isAccepted: boolean | null;
    readonly: boolean;
    requestFocus: TFocus | null;
}) => {
    if (isAccepted === true) {
        return i18n.t('page.request.calendar.statusDescription.accepted');
    }

    if (isAccepted === false) {
        return i18n.t('page.request.calendar.statusDescription.rejected');
    }

    if (requestFocus === null) {
        return i18n.t('page.request.calendar.statusDescription.noFocus');
    }

    if (readonly) {
        return i18n.t('page.request.calendar.statusDescription.readonly');
    }

    return i18n.t('page.request.calendar.statusDescription.editable');
};

export const getRequestFocus = (dutyRequest: TDutyRequest, shiftNurseIdByNurseId: Map<number, number>): TFocus | null => {
    const matchedShiftNurseId = shiftNurseIdByNurseId.get(dutyRequest.nurseId);

    if (matchedShiftNurseId === undefined) return null;

    return {
        shiftNurseName: dutyRequest.nurseName,
        shiftNurseId: matchedShiftNurseId,
        day: dutyRequest.date - 1,
    };
};

export const createRequestCalendarCellFocus = ({
    shiftNurseName,
    shiftNurseId,
    day,
}: {
    shiftNurseName: string;
    shiftNurseId: number;
    day: number;
}): TFocus => ({
    shiftNurseName,
    shiftNurseId,
    day,
});

export const getRequestCalendarCellState = ({
    currentShiftTypeId,
    requestDutyRequest,
    focus,
    shiftNurseId,
    day,
    wardShiftTypeMap,
}: {
    currentShiftTypeId: number | null;
    requestDutyRequest: TDutyRequest | null;
    focus: TFocus | null;
    shiftNurseId: number;
    day: number;
    wardShiftTypeMap: Map<number, TWardShiftType>;
}) => {
    const isOnlyRequest = currentShiftTypeId === null && requestDutyRequest !== null;

    return {
        isFocused: focus?.shiftNurseId === shiftNurseId && focus?.day === day,
        shiftType:
            currentShiftTypeId === null
                ? requestDutyRequest === null
                    ? null
                    : wardShiftTypeMap.get(requestDutyRequest.wardShiftTypeId)
                : wardShiftTypeMap.get(currentShiftTypeId),
        isOnlyRequest,
        isRejectedOnlyRequest: isOnlyRequest && requestDutyRequest.isAccepted === false,
    };
};

export const getRequestCalendarDivisionAction = ({
    readonly,
    rowIndex,
    rowCount,
    level,
    divisionCount,
}: {
    readonly: boolean;
    rowIndex: number;
    rowCount: number;
    level: number;
    divisionCount: number;
}) => {
    if (readonly) return null;

    if (rowIndex !== rowCount - 1) return 'create' as const;

    if (level !== divisionCount - 1) return 'delete' as const;

    return null;
};

export const getRequestCalendarRowClassName = (_params: {isFocusedRow: boolean}) =>
    'relative flex h-[clamp(28px,2.4cqw,40px)] w-full items-center gap-2 bg-white transition-colors';

export const getDayBadgeClass = (dayType: TRequestShift['days'][number]['dayType'], isFocused: boolean, _separateWeekendColor: boolean) => {
    if (dayType === 'saturday') {
        if (isFocused) return 'bg-blue text-white';

        return 'text-blue';
    }

    if (dayType === 'sunday' || dayType === 'holiday') {
        return isFocused ? 'bg-red text-white' : 'text-red';
    }

    if (dayType === 'workday') {
        return isFocused ? 'bg-main-1 text-white' : 'text-sub-2.5';
    }

    return '';
};

export const getDayCellClass = (
    dayType: TRequestShift['days'][number]['dayType'],
    isFocusedDay: boolean,
    _separateWeekendColor: boolean,
) => {
    const classes = [];

    if (dayType === 'sunday' || dayType === 'holiday') {
        classes.push('bg-red/5');
    } else if (dayType === 'saturday') {
        classes.push('bg-blue/5');
    }

    if (isFocusedDay) {
        classes.push('bg-main-light');
    }

    return classes.join(' ');
};

type TMoveNurseOrderPayload = {
    nurseId: number;
    destinationDivisionNum: number;
    prevPriority: number;
    nextPriority: number;
};

export const getMoveNurseOrderPayload = ({
    destination,
    draggableId,
    requestShift,
    source,
}: Pick<DropResult, 'destination' | 'draggableId' | 'source'> & {
    requestShift: TRequestShift;
} & Partial<Omit<DropResult, 'destination' | 'draggableId' | 'source'>>): TMoveNurseOrderPayload | null => {
    if (!destination) return null;

    const sourceDivision = Number.parseInt(source.droppableId, 10);
    const destinationDivision = Number.parseInt(destination.droppableId, 10);
    const draggedNurse = requestShift.divisionShiftNurses[sourceDivision].find(
        (row) => row.shiftNurse.shiftNurseId === Number.parseInt(draggableId, 10),
    )?.shiftNurse;

    if (!draggedNurse) return null;

    const destinationNurses = requestShift.divisionShiftNurses[destinationDivision];
    const destinationDivisionNum = destinationNurses[0]?.shiftNurse.divisionNum;

    if (destinationDivisionNum === undefined) return null;

    if (destination.droppableId === source.droppableId) {
        const currentIndex = destinationNurses.findIndex((row) => row.shiftNurse.shiftNurseId === draggedNurse.shiftNurseId);

        if (currentIndex !== -1 && currentIndex < destination.index) {
            return {
                nurseId: draggedNurse.nurseId,
                destinationDivisionNum,
                prevPriority: destination.index === 0 ? 0 : destinationNurses[destination.index].shiftNurse.priority,
                nextPriority:
                    destination.index === destinationNurses.length - 1
                        ? destinationNurses[destination.index].shiftNurse.priority + PRIORITY_GAP
                        : destinationNurses[destination.index + 1].shiftNurse.priority,
            };
        }
    }

    return {
        nurseId: draggedNurse.nurseId,
        destinationDivisionNum,
        prevPriority: destination.index === 0 ? 0 : destinationNurses[destination.index - 1].shiftNurse.priority,
        nextPriority:
            destination.index === destinationNurses.length
                ? destinationNurses[destination.index - 1].shiftNurse.priority + PRIORITY_GAP
                : destinationNurses[destination.index].shiftNurse.priority,
    };
};
