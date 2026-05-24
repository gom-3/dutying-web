import {useCallback, useMemo, useRef} from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import {events, sendEvent} from '@/analytics';
import {useUIConfigStore} from '@/entities/ui/useUIConfig/store';
import useAuth from '@/features/auth';
import useRequestShift from '@/features/request-shift';
import {getWardSkillSettings, resolveWardSkillLevels} from '@/features/ward-skill/model/skill-level';
import RequestCalendarGrid from './request-calendar/request-calendar-grid';
import RequestCalendarHeader from './request-calendar/request-calendar-header';
import RequestDutyRequestPanel from './request-calendar/request-duty-request-panel';
import {useRequestCalendarFocusScroll} from './request-calendar/use-request-calendar-focus-scroll';
import {createConnectedNurseIdSet, createDutyRequestLookup, createShiftNurseIdByNurseId} from './request-calendar/utils';

type TRequestCalendarProps = {
    defaultReviewMode?: 'date' | 'request' | 'pending' | 'nurse';
};

export default function ShiftCalendar({defaultReviewMode}: TRequestCalendarProps = {}) {
    const {
        state: {
            year,
            month,
            requestShift,
            dutyRequestList,
            dutyRequestStatus,
            updatingRequestId,
            focus,
            wardShiftTypeMap,
            currentShiftTeam,
            shiftTeams,
            editAvailability,
        },
        actions: {changeFocus, acceptRequest, acceptRequests, retry},
    } = useRequestShift();
    const {
        state: {wardId},
    } = useAuth();
    const separateWeekendColor = useUIConfigStore((state) => state.separateWeekendColor);
    const focusedCellRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const clickAwayRef = useOnclickOutside(() => {
        changeFocus(null);
    });
    const handleSelectCell = useCallback(
        (nextFocus: Parameters<typeof changeFocus>[0]) => {
            changeFocus(nextFocus);
            sendEvent(events.requestPage.calendar.focusCell);
        },
        [changeFocus],
    );
    const skillSettings = useMemo(() => getWardSkillSettings(wardId), [wardId]);
    const allWardNurses = useMemo(
        () => shiftTeams?.flatMap((shiftTeam) => shiftTeam.nurses) ?? currentShiftTeam?.nurses ?? [],
        [currentShiftTeam?.nurses, shiftTeams],
    );
    const {config: skillConfig, levelsByNurseId} = useMemo(
        () => resolveWardSkillLevels(allWardNurses, skillSettings),
        [allWardNurses, skillSettings],
    );

    useRequestCalendarFocusScroll({focus, focusedCellRef, containerRef});

    if (!requestShift || !wardShiftTypeMap || !currentShiftTeam) return null;

    const canEditRequests = editAvailability.canEdit;
    const dutyRequestLookup = createDutyRequestLookup(dutyRequestList);
    const connectedNurseIds = createConnectedNurseIdSet(currentShiftTeam);
    const shiftNurseIdByNurseId = createShiftNurseIdByNurseId(requestShift);

    return (
        <div
            id="calendar"
            className="mx-auto mt-2 grid min-h-0 w-full max-w-none flex-1 grid-cols-1 gap-2 xl:grid-cols-[minmax(0,1fr)_360px]"
        >
            <section className="min-h-0 min-w-0 rounded-[18px] bg-white" aria-label="신청 근무표">
                <div ref={clickAwayRef} className="flex h-full min-h-0 flex-col">
                    <div ref={containerRef} className="min-h-[420px] w-full overflow-visible">
                        <RequestCalendarHeader days={requestShift.days} focusDay={focus?.day} separateWeekendColor={separateWeekendColor} />
                        <RequestCalendarGrid
                            requestShift={requestShift}
                            focus={focus}
                            readonly={!canEditRequests}
                            separateWeekendColor={separateWeekendColor}
                            wardShiftTypeMap={wardShiftTypeMap}
                            dutyRequestLookup={dutyRequestLookup}
                            connectedNurseIds={connectedNurseIds}
                            skillConfig={skillConfig}
                            levelsByNurseId={levelsByNurseId}
                            focusedCellRef={focusedCellRef}
                            onSelectCell={handleSelectCell}
                        />
                    </div>
                </div>
            </section>
            <RequestDutyRequestPanel
                year={year}
                month={month}
                days={requestShift.days}
                dutyRequestList={dutyRequestList}
                dutyRequestStatus={dutyRequestStatus}
                wardShiftTypeMap={wardShiftTypeMap}
                canEdit={canEditRequests}
                updatingRequestId={updatingRequestId}
                shiftNurseIdByNurseId={shiftNurseIdByNurseId}
                changeFocus={changeFocus}
                acceptRequest={acceptRequest}
                acceptRequests={acceptRequests}
                retry={retry}
                onAcceptAnalytics={(accepted) => sendEvent(events.requestPage.acceptRequest, String(accepted))}
                defaultReviewMode={defaultReviewMode}
            />
        </div>
    );
}
