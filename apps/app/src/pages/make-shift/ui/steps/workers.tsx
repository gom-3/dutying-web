import {cn} from '@dutying/utils/style';
import {DragDropContext, type DropResult} from '@hello-pangea/dnd';
import {useQuery} from '@tanstack/react-query';
import {ArrowRight, ChevronDown} from 'lucide-react';
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {type TNurse} from '@/entities/nurse';
import {wardQueryOptions} from '@/entities/ward/model/queries';
import useAuth from '@/features/auth';
import useEditShiftTeam from '@/features/edit-shift-team';
import {getWardSkillSettings, resolveWardSkillLevels} from '@/features/ward-skill/model/skill-level';
import {getGroupedDivisionNurses} from '@/pages/member/model/shift-team-list';
import {PersonIcon} from '@/shared/assets/svg';
import ROUTE from '@/shared/constant/path';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import {DutyManagementStatusCard, ManagementActionButton} from '@/widgets/duty-management/ui';
import {useMakeShiftStore} from '../../model/make-shift-store';
import {
    applyMakeShiftWorkerDrag,
    buildMakeShiftWorkerMovePayload,
    freshenMakeShiftDisplayWorkers,
    sortMakeShiftWorkersInitialOrder,
} from '../../model/make-shift-worker-order';
import {WorkersList, WorkersTableHeader} from './workers-sections';

const MAKE_SHIFT_WORKER_SORT_OPTIONS = [
    {value: 'priority', labelKey: 'page.makeShift.workers.sortBySavedOrder'},
    {value: 'name', labelKey: 'page.makeShift.workers.sortByName'},
    {value: 'skill', labelKey: 'page.makeShift.workers.sortBySkill'},
] as const;

type TMakeShiftWorkerSortMode = (typeof MAKE_SHIFT_WORKER_SORT_OPTIONS)[number]['value'];

const compareWorkerName = (left: TNurse, right: TNurse) => {
    const byName = left.name.localeCompare(right.name, 'ko-KR', {sensitivity: 'base'});

    if (byName !== 0) return byName;

    return left.nurseId - right.nurseId;
};
const sortWorkersForDisplay = (
    workers: TNurse[],
    sortMode: TMakeShiftWorkerSortMode,
    levelsByNurseId: Record<number, number>,
    getWorkerState: (nurse: TNurse) => boolean,
) => {
    const activeWorkers = workers.filter((nurse) => getWorkerState(nurse));
    const inactiveWorkers = workers.filter((nurse) => !getWorkerState(nurse));

    if (sortMode === 'priority') return activeWorkers.concat(inactiveWorkers);

    const comparator =
        sortMode === 'name'
            ? compareWorkerName
            : (left: TNurse, right: TNurse) => {
                  const leftLevel = levelsByNurseId[left.nurseId] ?? Number.NEGATIVE_INFINITY;
                  const rightLevel = levelsByNurseId[right.nurseId] ?? Number.NEGATIVE_INFINITY;

                  if (rightLevel !== leftLevel) return rightLevel - leftLevel;

                  return compareWorkerName(left, right);
              };
    const sortByDivision = (nurses: TNurse[]) =>
        getGroupedDivisionNurses(nurses).flatMap(([, divisionNurses]) => [...divisionNurses].sort(comparator));

    return sortByDivision(activeWorkers).concat(sortByDivision(inactiveWorkers));
};
const reorderWorkersForWorkerToggle = (
    workers: TNurse[],
    nurseId: number,
    isWorker: boolean,
    getWorkerState: (nurse: TNurse) => boolean,
) => {
    const target = workers.find((nurse) => nurse.nurseId === nurseId);

    if (!target) return workers;

    const nextWorkers = workers.filter((nurse) => nurse.nurseId !== nurseId);
    const workerStateByNurseId = new Map(workers.map((nurse) => [nurse.nurseId, getWorkerState(nurse)]));

    workerStateByNurseId.set(nurseId, isWorker);

    const firstOffIndex = nextWorkers.findIndex((nurse) => !workerStateByNurseId.get(nurse.nurseId));
    const insertIndex = firstOffIndex === -1 ? nextWorkers.length : firstOffIndex;

    nextWorkers.splice(insertIndex, 0, target);

    return nextWorkers;
};

export function Workers() {
    const {t} = useTypedTranslation();
    const navigate = useNavigate();
    const {
        state: {wardId},
    } = useAuth();
    const currentShiftTeamId = useMakeShiftStore((s) => s.currentShiftTeamId);
    const year = useMakeShiftStore((s) => s.year);
    const month = useMakeShiftStore((s) => s.month);
    const enabled = wardId !== null && currentShiftTeamId !== null;
    const {
        state: {nurseSaveStatus},
        actions: {moveNurseOrder, updateNurse},
    } = useEditShiftTeam();
    const {data: teamNurses = []} = useQuery({
        ...wardQueryOptions.shiftTeamNurses(wardId ?? -1, currentShiftTeamId ?? -1),
        enabled,
    });
    const {data: ward} = useQuery({
        ...wardQueryOptions.id(wardId ?? -1),
        enabled: wardId !== null,
    });
    const sortedFromServer = useMemo(() => sortMakeShiftWorkersInitialOrder(teamNurses), [teamNurses]);
    const [sortMode, setSortMode] = useState<TMakeShiftWorkerSortMode>('priority');
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const sortMenuRef = useRef<HTMLDivElement>(null);
    const [orderCustomized, setOrderCustomized] = useState(false);
    const [localWorkers, setLocalWorkers] = useState<TNurse[]>([]);
    const [pendingWorkerByNurseId, setPendingWorkerByNurseId] = useState<Record<number, boolean>>({});
    const displayWorkersRef = useRef<TNurse[]>([]);
    const orderCustomizedRef = useRef(false);
    const rowRefByNurseId = useRef<Record<number, HTMLDivElement | null>>({});
    const previousTopByNurseIdRef = useRef<Record<number, number>>({});
    const previousNurseIdsRef = useRef<number[]>([]);
    const skipFlipAnimationOnceRef = useRef(false);

    orderCustomizedRef.current = orderCustomized;

    useEffect(() => {
        setOrderCustomized(false);
        setLocalWorkers([]);
        setPendingWorkerByNurseId({});
    }, [currentShiftTeamId, wardId]);

    useEffect(() => {
        if (!orderCustomized) return;

        setLocalWorkers((prev) => freshenMakeShiftDisplayWorkers(prev, teamNurses));
    }, [teamNurses, orderCustomized]);

    const allWardNurses = useMemo(
        () => ward?.shiftTeams.flatMap((shiftTeam) => shiftTeam.nurses) ?? sortedFromServer,
        [ward?.shiftTeams, sortedFromServer],
    );
    const skillSettings = useMemo(() => getWardSkillSettings(wardId), [wardId]);
    const {config: skillConfig, levelsByNurseId} = useMemo(
        () => resolveWardSkillLevels(allWardNurses, skillSettings),
        [allWardNurses, skillSettings],
    );
    const availableSortOptions = useMemo(
        () =>
            skillConfig.enabled
                ? MAKE_SHIFT_WORKER_SORT_OPTIONS
                : MAKE_SHIFT_WORKER_SORT_OPTIONS.filter((option) => option.value !== 'skill'),
        [skillConfig.enabled],
    );
    const getWorkerState = useCallback(
        (nurse: TNurse) => pendingWorkerByNurseId[nurse.nurseId] ?? nurse.isWorker,
        [pendingWorkerByNurseId],
    );
    const baseWorkers = orderCustomized ? localWorkers : sortedFromServer;
    const displayWorkers = useMemo(
        () => sortWorkersForDisplay(baseWorkers, sortMode, levelsByNurseId, getWorkerState),
        [baseWorkers, getWorkerState, levelsByNurseId, sortMode],
    );
    const grouped = useMemo(() => getGroupedDivisionNurses(displayWorkers), [displayWorkers]);
    const patchYearMonth = `${year}-${String(month).padStart(2, '0')}`;

    displayWorkersRef.current = displayWorkers;

    const setWorkerRowRef = useCallback((nurseId: number, element: HTMLDivElement | null) => {
        rowRefByNurseId.current[nurseId] = element;
    }, []);

    useLayoutEffect(() => {
        const nextTopByNurseId: Record<number, number> = {};
        const currentNurseIds = displayWorkers.map((nurse) => nurse.nurseId);
        const previousNurseIds = previousNurseIdsRef.current;
        const hasStructuralListChange =
            previousNurseIds.length !== currentNurseIds.length ||
            previousNurseIds.some((nurseId) => !currentNurseIds.includes(nurseId)) ||
            currentNurseIds.some((nurseId) => !previousNurseIds.includes(nurseId));
        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const shouldSkipFlipAnimation = skipFlipAnimationOnceRef.current || hasStructuralListChange;

        displayWorkers.forEach((nurse) => {
            const rowElement = rowRefByNurseId.current[nurse.nurseId];

            if (!rowElement) return;

            const nextTop = rowElement.offsetTop;
            const previousTop = previousTopByNurseIdRef.current[nurse.nurseId];

            nextTopByNurseId[nurse.nurseId] = nextTop;

            if (previousTop == null) return;

            const deltaY = previousTop - nextTop;

            if (Math.abs(deltaY) < 1) return;

            if (prefersReducedMotion || shouldSkipFlipAnimation) return;

            rowElement.style.transition = 'none';
            rowElement.style.transform = `translateY(${deltaY}px)`;
            rowElement.style.willChange = 'transform';

            requestAnimationFrame(() => {
                rowElement.style.transition = 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)';
                rowElement.style.transform = 'translateY(0)';
            });

            rowElement.addEventListener(
                'transitionend',
                () => {
                    rowElement.style.transition = '';
                    rowElement.style.willChange = '';
                },
                {once: true},
            );
        });

        previousTopByNurseIdRef.current = nextTopByNurseId;
        previousNurseIdsRef.current = currentNurseIds;
    }, [displayWorkers]);

    useEffect(() => {
        const skipFlipForReentry = () => {
            skipFlipAnimationOnceRef.current = true;
            previousTopByNurseIdRef.current = {};
            previousNurseIdsRef.current = [];

            requestAnimationFrame(() => {
                skipFlipAnimationOnceRef.current = false;
            });
        };

        skipFlipForReentry();

        const onVisibilityChange = () => {
            if (document.visibilityState !== 'visible') return;

            skipFlipForReentry();
        };

        window.addEventListener('pageshow', skipFlipForReentry);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            window.removeEventListener('pageshow', skipFlipForReentry);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);

    const onDragStart = useCallback(() => {
        skipFlipAnimationOnceRef.current = true;

        if (!orderCustomizedRef.current) {
            setLocalWorkers(displayWorkersRef.current);
        }

        setOrderCustomized(true);
    }, []);
    const onDragEnd = (result: DropResult) => {
        const releaseDragFlipSkip = () => {
            requestAnimationFrame(() => {
                skipFlipAnimationOnceRef.current = false;
            });
        };

        try {
            if (!result.destination || !currentShiftTeamId) return;

            const nurseId = Number.parseInt(result.draggableId, 10);

            if (Number.isNaN(nurseId)) return;

            const [srcTeamStr, srcDivStr] = result.source.droppableId.split(',');
            const [dstTeamStr, dstDivStr] = result.destination.droppableId.split(',');
            const srcTeamId = Number.parseInt(srcTeamStr!, 10);
            const dstTeamId = Number.parseInt(dstTeamStr!, 10);

            if (srcTeamId !== currentShiftTeamId || dstTeamId !== currentShiftTeamId) return;

            const srcDiv = Number.parseInt(srcDivStr!, 10);
            const dstDiv = Number.parseInt(dstDivStr!, 10);
            const displayForPayload = displayWorkersRef.current;
            const sourceWorkers = displayForPayload.filter((nurse) => nurse.divisionNum === srcDiv && getWorkerState(nurse));
            const destinationWorkers = displayForPayload.filter((nurse) => nurse.divisionNum === dstDiv && getWorkerState(nurse));
            const sourceWorkerIndex = sourceWorkers.findIndex((nurse) => nurse.nurseId === nurseId);
            const destinationWorkerIndex = Math.min(result.destination.index, destinationWorkers.length);

            if (sourceWorkerIndex === -1) return;

            const payload = buildMakeShiftWorkerMovePayload(
                teamNurses,
                displayForPayload,
                currentShiftTeamId,
                nurseId,
                srcDiv,
                dstDiv,
                sourceWorkerIndex,
                destinationWorkerIndex,
            );

            if (!payload) return;

            const nextDisplay = applyMakeShiftWorkerDrag(
                displayForPayload,
                nurseId,
                srcDiv,
                dstDiv,
                sourceWorkerIndex,
                destinationWorkerIndex,
            );

            if (!nextDisplay) return;

            setLocalWorkers(nextDisplay);
            setSortMode('priority');

            void moveNurseOrder(
                payload.nurseId,
                payload.sourceShiftTeamId,
                payload.destinationShiftTeamId,
                payload.divisionNum,
                payload.prevPriority,
                payload.nextPriority,
                patchYearMonth,
            );
        } finally {
            releaseDragFlipSkip();
        }
    };
    const workerCount = displayWorkers.length;
    const activeWorkerCount = displayWorkers.filter((nurse) => getWorkerState(nurse)).length;
    const currentShiftTeamName =
        ward?.shiftTeams.find((shiftTeam) => shiftTeam.shiftTeamId === currentShiftTeamId)?.name ?? t('page.makeShift.overview.noTeamsLabel');
    const noNurseTitle = `${currentShiftTeamName}에는 아직 간호사가 없어요`;
    const noNurseDescription = '근무표를 만들려면 먼저 간호사를 추가해 주세요. 근무자 관리에서 바로 시작할 수 있어요';
    const selectedSortOption = availableSortOptions.find((option) => option.value === sortMode) ?? availableSortOptions[0];
    const isWorkerToggleBusy = nurseSaveStatus === 'saving';

    useEffect(() => {
        if (skillConfig.enabled || sortMode !== 'skill') return;

        setSortMode('priority');
    }, [skillConfig.enabled, sortMode]);

    useEffect(() => {
        if (!sortMenuOpen) return;

        const handlePointerDown = (event: MouseEvent) => {
            if (sortMenuRef.current?.contains(event.target as Node)) return;

            setSortMenuOpen(false);
        };

        document.addEventListener('mousedown', handlePointerDown);

        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [sortMenuOpen]);

    useEffect(() => {
        if (Object.keys(pendingWorkerByNurseId).length === 0) return;

        setPendingWorkerByNurseId((prev) => {
            const next = {...prev};

            let changed = false;

            teamNurses.forEach((nurse) => {
                const pending = next[nurse.nurseId];

                if (pending == null) return;

                if (pending !== nurse.isWorker) return;

                delete next[nurse.nurseId];
                changed = true;
            });

            return changed ? next : prev;
        });
    }, [pendingWorkerByNurseId, teamNurses]);

    const handleToggleWorker = useCallback(
        async (nurse: TNurse, checked: boolean) => {
            if (isWorkerToggleBusy) return;

            if (getWorkerState(nurse) === checked) return;

            if (!orderCustomizedRef.current) {
                setLocalWorkers(displayWorkersRef.current);
            }

            setOrderCustomized(true);
            setSortMode('priority');

            const previousDisplayWorkers = displayWorkersRef.current;
            const nextDisplayWorkers = reorderWorkersForWorkerToggle(previousDisplayWorkers, nurse.nurseId, checked, getWorkerState);

            setLocalWorkers(nextDisplayWorkers);
            setPendingWorkerByNurseId((prev) => ({...prev, [nurse.nurseId]: checked}));

            const saved = await updateNurse(nurse.nurseId, {...nurse, isWorker: checked});

            if (saved) return;

            setPendingWorkerByNurseId((prev) => {
                const next = {...prev};

                delete next[nurse.nurseId];

                return next;
            });
            setLocalWorkers(previousDisplayWorkers);
        },
        [getWorkerState, isWorkerToggleBusy, updateNurse],
    );

    return (
        <div id="make_workers_step" className="make-shift-workers-root flex min-w-0 flex-col items-end">
            <div className="make-shift-workers w-[90%] min-w-0 rounded-[18px] bg-[#F8F9FB] px-[clamp(14px,1.5vw,22px)] py-[clamp(14px,1.5vw,22px)]">
                {workerCount > 0 ? (
                    <>
                        <div className="mb-3 flex min-w-0 items-center justify-between gap-3 px-1">
                            <span
                                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 font-apple text-[12px] font-semibold text-sub-2"
                                aria-label={t('page.makeShift.workers.activeCount', {count: activeWorkerCount})}
                            >
                                <PersonIcon aria-hidden className="size-3.5 shrink-0" />
                                <span className="tabular-nums">{t('page.makeShift.workers.activeCount', {count: activeWorkerCount})}</span>
                            </span>
                            <div ref={sortMenuRef} className="relative">
                                <button
                                    type="button"
                                    aria-haspopup="listbox"
                                    aria-expanded={sortMenuOpen}
                                    aria-label={t('page.makeShift.workers.sortListMenuAria')}
                                    className={cn(
                                        'flex h-8 min-w-[132px] items-center justify-between gap-3 rounded-[5px] bg-gray-6 px-3 font-apple text-[14px] font-medium text-gray-3 transition-colors focus-visible:outline-2 focus-visible:outline-main-1',
                                        sortMenuOpen ? 'bg-white text-sub-1 shadow-[0px_10px_28px_rgba(95,100,135,0.16)]' : 'hover:bg-gray-7',
                                    )}
                                    onClick={() => setSortMenuOpen((prev) => !prev)}
                                >
                                    <span>{selectedSortOption ? t(selectedSortOption.labelKey) : ''}</span>
                                    <ChevronDown
                                        aria-hidden="true"
                                        className={cn('h-4 w-4 shrink-0 transition-transform', sortMenuOpen && 'rotate-180')}
                                    />
                                </button>
                                {sortMenuOpen ? (
                                    <div
                                        role="listbox"
                                        className="absolute top-full right-0 z-20 mt-1 w-[150px] animate-in overflow-hidden rounded-[10px] border border-gray-6 bg-white py-1 shadow-[0px_10px_28px_rgba(95,100,135,0.16)] duration-150 fade-in-0 zoom-in-95 slide-in-from-top-1"
                                    >
                                        {availableSortOptions.map((option) => {
                                            const isSelected = sortMode === option.value;

                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    className={cn(
                                                        'flex w-full items-center px-4 py-2.5 text-left font-apple text-[15px] transition-colors hover:bg-gray-7 focus-visible:outline-2 focus-visible:outline-main-1',
                                                        isSelected ? 'bg-main-light font-semibold text-main-1' : 'text-sub-1',
                                                    )}
                                                    onClick={() => {
                                                        setSortMode(option.value);
                                                        setSortMenuOpen(false);
                                                    }}
                                                >
                                                    {t(option.labelKey)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <WorkersTableHeader showSkill={skillConfig.enabled} />
                    </>
                ) : null}

                {workerCount === 0 ? (
                    <DutyManagementStatusCard
                        title={noNurseTitle}
                        description={noNurseDescription}
                        descriptionClassName="max-w-none whitespace-nowrap"
                        actions={
                            <ManagementActionButton
                                size="sm"
                                variant="neutral"
                                onClick={() => {
                                    navigate(ROUTE.MEMBER);
                                }}
                            >
                                <ArrowRight aria-hidden className="size-4" />
                                근무자 관리로 이동
                            </ManagementActionButton>
                        }
                        className="mt-3 min-h-[220px] border-0 bg-white"
                    />
                ) : currentShiftTeamId !== null ? (
                    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                        <WorkersList
                            grouped={grouped}
                            shiftTeamId={currentShiftTeamId}
                            levelsByNurseId={levelsByNurseId}
                            skillConfig={skillConfig}
                            isBusy={isWorkerToggleBusy}
                            getWorkerState={getWorkerState}
                            onToggleWorker={(nurse, checked) => void handleToggleWorker(nurse, checked)}
                            setRowRef={setWorkerRowRef}
                        />
                    </DragDropContext>
                ) : null}
            </div>
        </div>
    );
}
