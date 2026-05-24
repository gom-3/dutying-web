import {useMemo, useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {type TDutyRequest, type TRequestShift} from '@/entities/shift';
import ShiftBadge from '@/entities/shift/ui/shift-badge';
import {type TWardShiftType} from '@/entities/ward';
import {type TFocus} from '@/features/request-shift/model/types';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import PageState from '@/shared/ui/PageState';
import {getRequestFocus} from './utils';

interface IRequestDutyRequestPanelProps {
    year: number;
    month: number;
    days: TRequestShift['days'];
    dutyRequestList: TDutyRequest[] | undefined;
    dutyRequestStatus: 'pending' | 'error' | 'success';
    wardShiftTypeMap: Map<number, TWardShiftType>;
    canEdit: boolean;
    updatingRequestId: number | null;
    shiftNurseIdByNurseId: Map<number, number>;
    changeFocus: (focus: TFocus | null) => void;
    acceptRequest: (reqShiftId: number, isAccepted: boolean | null) => Promise<boolean>;
    acceptRequests: (reqShiftIds: number[], isAccepted: boolean | null) => Promise<boolean>;
    retry: () => Promise<unknown>;
    onAcceptAnalytics: (accepted: boolean) => void;
    defaultReviewMode?: TReviewMode;
}

type TReviewMode = 'date' | 'request' | 'pending' | 'nurse';
type TRequestRowLabelMode = 'nurse' | 'nurse-date' | 'date';

type TRequestDateGroup = {
    key: string;
    date: number;
    requests: TDutyRequest[];
};

type TRequestNurseGroup = {
    key: string;
    nurseId: number;
    nurseName: string;
    requests: TDutyRequest[];
};

const REQUEST_DATE_GROUP_PAGE_SIZE = 4;
const REQUEST_NURSE_GROUP_PAGE_SIZE = 4;
const REQUEST_ROW_PAGE_SIZE = 9;
const REVIEW_PANEL_SURFACE_CLASS_NAME = 'bg-gray-7';
const REVIEW_ROW_SURFACE_CLASS_NAME = 'bg-white';
const WEEKDAY_LABELS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
const getRequestTimestamp = (request: TDutyRequest) => {
    const timestamp = new Date(request.requestDate).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
};
const sortByRequestDate = (current: TDutyRequest, next: TDutyRequest) => {
    const requestDateDiff = getRequestTimestamp(current) - getRequestTimestamp(next);

    if (requestDateDiff !== 0) return requestDateDiff;

    return current.wardReqShiftId - next.wardReqShiftId;
};
const sortByDateThenRequest = (current: TDutyRequest, next: TDutyRequest) => {
    const dateDiff = current.date - next.date;

    if (dateDiff !== 0) return dateDiff;

    return sortByRequestDate(current, next);
};
const sortByNurseName = (current: TRequestNurseGroup, next: TRequestNurseGroup) => {
    const nameDiff = current.nurseName.localeCompare(next.nurseName, 'ko');

    if (nameDiff !== 0) return nameDiff;

    return current.nurseId - next.nurseId;
};
const getRequestShiftType = (request: TDutyRequest, wardShiftTypeMap: Map<number, TWardShiftType>) => {
    const shiftType = wardShiftTypeMap.get(request.wardShiftTypeId);

    if (shiftType) return shiftType;

    return {
        wardShiftTypeId: request.wardShiftTypeId,
        name: request.wardShiftTypeShortName,
        shortName: request.wardShiftTypeShortName,
        color: request.wardShiftTypeColor,
        startTime: '',
        endTime: '',
        isDefault: false,
        isOff: request.wardShiftTypeShortName === 'O',
        isCounted: request.wardShiftTypeShortName !== 'O',
        classification: request.wardShiftTypeShortName === 'N' ? 'NIGHT' : request.wardShiftTypeShortName === 'O' ? 'OFF' : 'DAY',
    } as TWardShiftType;
};
const getActionButtonClassName = ({active, tone}: {active: boolean; tone: 'accept' | 'reject'}) =>
    twMerge(
        'h-8 min-w-0 rounded-[10px] px-2 font-apple text-[12px] font-semibold transition-colors disabled:cursor-wait disabled:opacity-60',
        active && tone === 'accept' && 'bg-main-1 text-white hover:bg-main-2',
        active && tone === 'reject' && 'bg-gray-3 text-white hover:bg-sub-2',
        !active && 'bg-[#EDF2F7] text-gray-3 hover:bg-[#E4ECF5] hover:text-sub-1',
    );
const getDateMeta = ({year, month, date, days}: {year: number; month: number; date: number; days: TRequestShift['days']}) => {
    const dayType = days.find((day) => day.day === date)?.dayType ?? 'workday';

    if (dayType === 'holiday') {
        return {
            label: '공휴일',
            className: 'text-red',
        };
    }

    if (dayType === 'saturday') {
        return {
            label: '토요일',
            className: 'text-blue',
        };
    }

    if (dayType === 'sunday') {
        return {
            label: '일요일',
            className: 'text-red',
        };
    }

    return {
        label: WEEKDAY_LABELS[new Date(year, month - 1, date).getDay()] ?? '',
        className: 'text-gray-4',
    };
};

export default function RequestDutyRequestPanel({
    year,
    month,
    days,
    dutyRequestList,
    dutyRequestStatus,
    wardShiftTypeMap,
    canEdit,
    updatingRequestId,
    shiftNurseIdByNurseId,
    changeFocus,
    acceptRequest,
    retry,
    onAcceptAnalytics,
    defaultReviewMode = 'date',
}: IRequestDutyRequestPanelProps) {
    const {t} = useTypedTranslation();
    const [reviewMode, setReviewMode] = useState<TReviewMode>(defaultReviewMode);
    const [requestPageIndex, setRequestPageIndex] = useState(0);
    const isRequestActionLocked = updatingRequestId !== null;
    const isBulkUpdating = updatingRequestId === -1;
    const displayedRequestList = canEdit ? dutyRequestList : dutyRequestList?.filter((request) => request.isAccepted === true);
    const panelTitle = canEdit ? t('page.request.panel.editTitle') : t('page.request.panel.readonlyTitle');
    const emptyTitle = canEdit ? t('page.request.panel.emptyTitleEdit') : t('page.request.panel.emptyTitleReadonly');
    const emptyDescription = canEdit ? t('page.request.panel.emptyDescriptionEdit') : t('page.request.panel.emptyDescriptionReadonly');
    const sortedRequestList = useMemo(
        () => [...(displayedRequestList ?? [])].sort(reviewMode === 'date' ? sortByDateThenRequest : sortByRequestDate),
        [displayedRequestList, reviewMode],
    );
    const pendingRequestList = useMemo(
        () => sortedRequestList.filter((request) => request.isAccepted === null).sort(sortByRequestDate),
        [sortedRequestList],
    );
    const panelDisplayTitle = canEdit ? `${panelTitle} (${pendingRequestList.length})` : panelTitle;
    const requestDateGroups = useMemo(() => {
        const groupMap = new Map<number, TDutyRequest[]>();

        for (const request of sortedRequestList) {
            const currentRequests = groupMap.get(request.date);

            if (currentRequests) {
                currentRequests.push(request);
                continue;
            }

            groupMap.set(request.date, [request]);
        }

        return [...groupMap.entries()]
            .map(
                ([date, requests]): TRequestDateGroup => ({
                    key: String(date),
                    date,
                    requests: [...requests].sort(sortByRequestDate),
                }),
            )
            .sort((current, next) => current.date - next.date);
    }, [sortedRequestList]);
    const requestNurseGroups = useMemo(() => {
        const groupMap = new Map<number, TRequestNurseGroup>();

        for (const request of sortedRequestList) {
            const currentGroup = groupMap.get(request.nurseId);

            if (currentGroup) {
                currentGroup.requests.push(request);
                continue;
            }

            groupMap.set(request.nurseId, {
                key: String(request.nurseId),
                nurseId: request.nurseId,
                nurseName: request.nurseName,
                requests: [request],
            });
        }

        return [...groupMap.values()]
            .map((group) => ({
                ...group,
                requests: [...group.requests].sort(sortByDateThenRequest),
            }))
            .sort(sortByNurseName);
    }, [sortedRequestList]);
    const flatRequestList = reviewMode === 'pending' ? pendingRequestList : sortedRequestList;
    const totalDisplayCount =
        reviewMode === 'date' ? requestDateGroups.length : reviewMode === 'nurse' ? requestNurseGroups.length : flatRequestList.length;
    const pageSize =
        reviewMode === 'date'
            ? REQUEST_DATE_GROUP_PAGE_SIZE
            : reviewMode === 'nurse'
              ? REQUEST_NURSE_GROUP_PAGE_SIZE
              : REQUEST_ROW_PAGE_SIZE;
    const lastPageIndex = Math.max(Math.ceil(totalDisplayCount / pageSize) - 1, 0);
    const currentPageIndex = Math.min(requestPageIndex, lastPageIndex);
    const visibleStartIndex = currentPageIndex * pageSize;
    const visibleDateGroups = requestDateGroups.slice(visibleStartIndex, visibleStartIndex + pageSize);
    const visibleNurseGroups = requestNurseGroups.slice(visibleStartIndex, visibleStartIndex + pageSize);
    const visibleFlatRequests = flatRequestList.slice(visibleStartIndex, visibleStartIndex + pageSize);
    const visibleEndIndex =
        visibleStartIndex +
        (reviewMode === 'date'
            ? visibleDateGroups.length
            : reviewMode === 'nurse'
              ? visibleNurseGroups.length
              : visibleFlatRequests.length);
    const hasRequestPagination = totalDisplayCount > pageSize;
    const hasAnyRequest = sortedRequestList.length > 0;
    const hasVisibleRequest = totalDisplayCount > 0;
    const reviewModeOptions: Array<{value: TReviewMode; label: string; count?: number}> = [
        {value: 'date', label: t('page.request.panel.sortByDate')},
        {value: 'nurse', label: t('page.request.panel.sortByNurse')},
        {value: 'request', label: t('page.request.panel.sortByRequestOrder')},
        {value: 'pending', label: t('page.request.panel.sortByPending'), count: pendingRequestList.length},
    ];
    const pendingEmptyTitle = t('page.request.panel.pendingEmptyTitle');
    const pendingEmptyDescription = t('page.request.panel.pendingEmptyDescription');
    const decideRequest = async (dutyRequest: TDutyRequest, nextAccepted: boolean | null) => {
        if (isRequestActionLocked) return;

        const accepted = await acceptRequest(dutyRequest.wardReqShiftId, nextAccepted);

        if (!accepted) return;

        if (nextAccepted !== null) {
            onAcceptAnalytics(nextAccepted);
        }
    };
    const renderRequestRow = (dutyRequest: TDutyRequest, labelMode: TRequestRowLabelMode) => {
        const requestFocus = getRequestFocus(dutyRequest, shiftNurseIdByNurseId);
        const isUpdating = updatingRequestId === dutyRequest.wardReqShiftId || isBulkUpdating;
        const isAccepted = dutyRequest.isAccepted === true;
        const isRejected = dutyRequest.isAccepted === false;
        const dateLabel = t('page.request.panel.dateLabel', {month, date: dutyRequest.date});
        const primaryLabel = labelMode === 'date' ? dateLabel : dutyRequest.nurseName;
        const secondaryLabel = labelMode === 'nurse-date' ? dateLabel : null;
        const focusRequest = () => {
            if (!requestFocus) return;

            changeFocus(requestFocus);
        };

        return (
            <div
                key={dutyRequest.wardReqShiftId}
                className={twMerge(
                    'flex min-w-0 items-center gap-2 rounded-[12px] px-2.5 py-2 transition-colors',
                    REVIEW_ROW_SURFACE_CLASS_NAME,
                    requestFocus && 'hover:bg-[#FBFDFF]',
                    isUpdating && 'opacity-70',
                )}
            >
                <button
                    type="button"
                    className={twMerge(
                        'flex min-w-0 flex-1 items-center gap-2 text-left',
                        requestFocus ? 'cursor-pointer' : 'cursor-default',
                    )}
                    onClick={focusRequest}
                >
                    <span className="min-w-0 truncate font-apple text-[13px] font-semibold text-sub-1">{primaryLabel}</span>
                    {secondaryLabel ? (
                        <span className="shrink-0 font-apple text-[12px] font-medium text-gray-4">{secondaryLabel}</span>
                    ) : null}
                </button>
                <button
                    type="button"
                    className={twMerge(
                        'grid size-[22px] shrink-0 place-items-center rounded-[7px] transition-transform disabled:opacity-100',
                        requestFocus ? 'cursor-pointer hover:scale-[1.04] active:scale-95' : 'cursor-default',
                    )}
                    disabled={!requestFocus}
                    aria-label={`${dutyRequest.nurseName} ${dateLabel} ${t('page.request.panel.viewOnCalendar')}`}
                    onClick={focusRequest}
                >
                    <ShiftBadge
                        shiftType={getRequestShiftType(dutyRequest, wardShiftTypeMap)}
                        className={twMerge('pointer-events-none shrink-0 rounded-[7px] text-[12px]', 'size-[22px]')}
                    />
                </button>
                {canEdit ? (
                    <div className="ml-auto grid w-[106px] shrink-0 grid-cols-2 gap-1">
                        <button
                            type="button"
                            className={getActionButtonClassName({active: isAccepted, tone: 'accept'})}
                            disabled={isRequestActionLocked}
                            aria-pressed={isAccepted}
                            onClick={() => void decideRequest(dutyRequest, isAccepted ? null : true)}
                        >
                            {t('page.request.panel.accept')}
                        </button>
                        <button
                            type="button"
                            className={getActionButtonClassName({active: isRejected, tone: 'reject'})}
                            disabled={isRequestActionLocked}
                            aria-pressed={isRejected}
                            onClick={() => void decideRequest(dutyRequest, isRejected ? null : false)}
                        >
                            {t('page.request.panel.reject')}
                        </button>
                    </div>
                ) : null}
            </div>
        );
    };

    return (
        <aside id="nurse_request_list" className="h-fit w-full rounded-[18px] bg-white" aria-label={panelDisplayTitle}>
            <div className="px-2.5 pt-2.5">
                <div className="min-w-0">
                    <p className="font-apple text-[17px] font-semibold text-sub-1">{panelDisplayTitle}</p>
                </div>
                {canEdit && hasAnyRequest ? (
                    <div
                        className="mt-3 grid w-full grid-cols-4 rounded-[12px] bg-[#F2F4F6] p-0.5"
                        aria-label={t('page.request.panel.viewModeLabel')}
                    >
                        {reviewModeOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={twMerge(
                                    'relative h-8 rounded-[9px] px-2 font-apple text-[12px] font-semibold transition-colors',
                                    reviewMode === option.value ? 'bg-white text-sub-1' : 'text-gray-4 hover:text-sub-1',
                                )}
                                aria-pressed={reviewMode === option.value}
                                onClick={() => {
                                    setReviewMode(option.value);
                                    setRequestPageIndex(0);
                                }}
                            >
                                {option.label}
                                {option.count !== undefined && option.count > 0 ? (
                                    <span className="absolute -top-1.5 right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F07C84] px-1 font-poppins text-[10px] leading-none font-semibold text-white">
                                        {option.count}
                                    </span>
                                ) : null}
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>

            <div className="px-2 pt-3 pb-2">
                {dutyRequestStatus === 'pending' ? (
                    <PageState
                        tone="loading"
                        title={canEdit ? t('page.request.panel.loadingTitleEdit') : t('page.request.panel.loadingTitleReadonly')}
                        description={
                            canEdit ? t('page.request.panel.loadingDescriptionEdit') : t('page.request.panel.loadingDescriptionReadonly')
                        }
                        className="min-h-[132px] px-5 py-6"
                    />
                ) : dutyRequestStatus === 'error' ? (
                    <PageState
                        tone="error"
                        title={canEdit ? t('page.request.panel.errorTitleEdit') : t('page.request.panel.errorTitleReadonly')}
                        description={t('page.state.errorDescription')}
                        action={{label: t('page.state.retry'), onClick: () => void retry()}}
                        className="min-h-[132px] px-5 py-6"
                    />
                ) : hasVisibleRequest ? (
                    <>
                        {reviewMode === 'date' ? (
                            <div className="flex flex-col gap-1.5">
                                {visibleDateGroups.map((requestGroup) =>
                                    (() => {
                                        const dateMeta = getDateMeta({year, month, date: requestGroup.date, days});

                                        return (
                                            <section
                                                key={requestGroup.key}
                                                className={twMerge('flex gap-1.5 rounded-[16px] p-1.5', REVIEW_PANEL_SURFACE_CLASS_NAME)}
                                            >
                                                <div className="flex w-[62px] shrink-0 flex-col items-center justify-center text-center">
                                                    <span className="font-apple text-[11px] leading-none font-semibold text-gray-4">
                                                        {month}월
                                                    </span>
                                                    <span className="mt-1 font-apple text-[17px] leading-none font-semibold tracking-[-0.03em] text-sub-1">
                                                        {requestGroup.date}일
                                                    </span>
                                                    <span
                                                        className={twMerge(
                                                            'mt-1.5 font-apple text-[11px] leading-none font-medium',
                                                            dateMeta.className,
                                                        )}
                                                    >
                                                        {dateMeta.label}
                                                    </span>
                                                </div>
                                                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                                    {requestGroup.requests.map((dutyRequest) => renderRequestRow(dutyRequest, 'nurse'))}
                                                </div>
                                            </section>
                                        );
                                    })(),
                                )}
                            </div>
                        ) : reviewMode === 'nurse' ? (
                            <div className="flex flex-col gap-1.5">
                                {visibleNurseGroups.map((requestGroup) => (
                                    <section
                                        key={requestGroup.key}
                                        className={twMerge('flex gap-1.5 rounded-[16px] p-1.5', REVIEW_PANEL_SURFACE_CLASS_NAME)}
                                    >
                                        <div className="flex w-[62px] shrink-0 flex-col items-center justify-center text-center">
                                            <span className="max-w-full truncate font-apple text-[15px] leading-none font-semibold tracking-[-0.02em] text-sub-1">
                                                {requestGroup.nurseName}
                                            </span>
                                            <span className="mt-1.5 font-apple text-[11px] leading-none font-medium text-gray-4">
                                                {t('page.request.panel.groupRequestCaseCount', {count: requestGroup.requests.length})}
                                            </span>
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                            {requestGroup.requests.map((dutyRequest) => renderRequestRow(dutyRequest, 'date'))}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        ) : (
                            <div className={twMerge('flex flex-col gap-1.5 rounded-[16px] p-2', REVIEW_PANEL_SURFACE_CLASS_NAME)}>
                                {visibleFlatRequests.map((dutyRequest) => renderRequestRow(dutyRequest, 'nurse-date'))}
                            </div>
                        )}
                        {hasRequestPagination ? (
                            <div className="mt-2 flex items-center justify-between gap-2">
                                <button
                                    type="button"
                                    className="h-9 rounded-full bg-gray-7 px-4 font-apple text-[13px] font-semibold text-sub-2 transition-colors hover:bg-gray-6/60 disabled:cursor-not-allowed disabled:text-gray-4 disabled:opacity-50"
                                    disabled={currentPageIndex === 0}
                                    onClick={() => setRequestPageIndex((current) => Math.max(current - 1, 0))}
                                >
                                    {t('page.request.panel.showPrevious')}
                                </button>
                                <span className="font-poppins text-[12px] font-medium text-gray-4">
                                    {visibleStartIndex + 1}-{visibleEndIndex} / {totalDisplayCount}
                                </span>
                                <button
                                    type="button"
                                    className="h-9 rounded-full bg-gray-7 px-4 font-apple text-[13px] font-semibold text-sub-2 transition-colors hover:bg-gray-6/60 disabled:cursor-not-allowed disabled:text-gray-4 disabled:opacity-50"
                                    disabled={currentPageIndex === lastPageIndex}
                                    onClick={() => setRequestPageIndex((current) => Math.min(current + 1, lastPageIndex))}
                                >
                                    {t('page.request.panel.showNext')}
                                </button>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <PageState
                        tone="empty"
                        title={reviewMode === 'pending' && hasAnyRequest ? pendingEmptyTitle : emptyTitle}
                        description={reviewMode === 'pending' && hasAnyRequest ? pendingEmptyDescription : emptyDescription}
                        className="min-h-[132px] px-5 py-6"
                    />
                )}
            </div>
        </aside>
    );
}
