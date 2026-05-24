import {cn} from '@dutying/utils/style';
import {DragDropContext, Draggable, Droppable, type DropResult} from '@hello-pangea/dnd';
import {Check, ChevronDown, Plus, X} from 'lucide-react';
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {SixDotsIcon} from '@/shared/assets/svg';
import {Input} from '@/shared/ui/primitives/input';
import {Switch} from '@/shared/ui/primitives/switch';
import {
    MAX_ONBOARDING_NURSE_NAME_LENGTH,
    sortNursesByMode,
    type TOnboardingNurseDraft,
    type TOnboardingWardDraft,
    type TSortMode,
} from '../../model';
import {ShiftBadge, SkillBadge} from './badges';
import TeamTabs from './team-tabs';

interface INurseStepProps {
    draft: TOnboardingWardDraft;
    selectedTeamId: string;
    showSkillColumn: boolean;
    sortMode: TSortMode;
    onSortModeChange: (sortMode: TSortMode) => void;
    onSelectTeam: (teamId: string) => void;
    onAddTeam: () => void;
    canAddTeam: boolean;
    onAddNurse: () => void;
    onDeleteNurse: (nurseId: string) => void;
    onNurseChange: (nurseId: string, updater: Partial<TOnboardingNurseDraft>) => void;
    onTeamNameChange: (teamId: string, teamName: string) => void;
    onDragEnd: (result: DropResult) => void;
}

const SORT_OPTIONS: {value: TSortMode; label: string}[] = [
    {value: 'manual', label: '수동순'},
    {value: 'name', label: '가나다순'},
    {value: 'skill', label: '숙련도순'},
];
const SKILL_UNSELECTED_LABEL = '숙련도 미선택';
const SKILL_UNSELECTED_OPTION_LABEL = '미선택';
const SKILL_UNSELECTED_BACKGROUND = '#E5E7EB';
const SKILL_UNSELECTED_TEXT = '#6B7280';
const NURSE_GRID_PADDING_X = 'px-6';
const NURSE_GRID_GAP_CLASS = 'gap-x-3';
const NURSE_GRID_COLS_STEP_3 = 'grid-cols-[32px_minmax(168px,1.15fr)_minmax(220px,1.55fr)_minmax(84px,0.65fr)_minmax(96px,0.72fr)_40px]';
const NURSE_GRID_COLS_STEP_4 =
    'grid-cols-[32px_minmax(168px,1.05fr)_minmax(116px,0.78fr)_minmax(196px,1.35fr)_minmax(84px,0.62fr)_minmax(96px,0.72fr)_40px]';
const getDefaultSkillLabel = (level: number) => `LV. ${level}`;
const limitNurseNameInput = (value: string) => value.slice(0, MAX_ONBOARDING_NURSE_NAME_LENGTH);

function NurseStep({
    draft,
    selectedTeamId,
    showSkillColumn,
    sortMode,
    onSortModeChange,
    onSelectTeam,
    onAddTeam,
    canAddTeam,
    onAddNurse,
    onDeleteNurse,
    onNurseChange,
    onTeamNameChange,
    onDragEnd,
}: INurseStepProps) {
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [openedSkillMenuNurseId, setOpenedSkillMenuNurseId] = useState<string | null>(null);
    const sortMenuRef = useRef<HTMLDivElement | null>(null);
    const skillMenuRef = useRef<HTMLDivElement | null>(null);
    const rowRefByNurseId = useRef<Record<string, HTMLDivElement | null>>({});
    const previousTopByNurseIdRef = useRef<Record<string, number>>({});
    const skipFlipAnimationOnceRef = useRef(false);
    const availableSortOptions = showSkillColumn ? SORT_OPTIONS : SORT_OPTIONS.filter((option) => option.value !== 'skill');
    const selectedSortOption = availableSortOptions.find((option) => option.value === sortMode) ?? availableSortOptions[0];
    const currentNurses = useMemo(() => draft.nurses.filter((nurse) => nurse.teamId === selectedTeamId), [draft.nurses, selectedTeamId]);
    const sortedNurses = useMemo(() => sortNursesByMode(currentNurses, sortMode), [currentNurses, sortMode]);
    const hasNursesInSelectedTeam = currentNurses.length > 0;
    const activeShiftTypes = useMemo(() => draft.shiftTypes.filter((shiftType) => shiftType.shortName), [draft.shiftTypes]);
    const levelItems = useMemo(
        () => Array.from({length: draft.skillLevelConfig.levelCount}, (_, index) => draft.skillLevelConfig.levelCount - index),
        [draft.skillLevelConfig.levelCount],
    );
    const getSkillLabel = (level: number) => draft.skillLevelConfig.levelLabels?.[level] ?? getDefaultSkillLabel(level);
    const gridTemplateClass = showSkillColumn ? NURSE_GRID_COLS_STEP_4 : NURSE_GRID_COLS_STEP_3;
    const handleDragEnd = (result: DropResult) => {
        skipFlipAnimationOnceRef.current = true;
        onDragEnd(result);

        requestAnimationFrame(() => {
            skipFlipAnimationOnceRef.current = false;
        });
    };

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;

            if (sortMenuRef.current?.contains(target)) {
                return;
            }

            setIsSortMenuOpen(false);
        };

        document.addEventListener('mousedown', closeOnOutsideClick);

        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick);
        };
    }, []);

    useEffect(() => {
        if (!openedSkillMenuNurseId) {
            return;
        }

        const closeOnOutsideClick = (event: MouseEvent) => {
            if (skillMenuRef.current?.contains(event.target as Node)) {
                return;
            }

            setOpenedSkillMenuNurseId(null);
        };

        document.addEventListener('mousedown', closeOnOutsideClick);

        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick);
        };
    }, [openedSkillMenuNurseId]);

    useEffect(() => {
        if (!showSkillColumn) {
            setOpenedSkillMenuNurseId(null);
        }
    }, [showSkillColumn]);

    useEffect(() => {
        if (hasNursesInSelectedTeam) {
            return;
        }

        setIsSortMenuOpen(false);
        setOpenedSkillMenuNurseId(null);
    }, [hasNursesInSelectedTeam]);

    useLayoutEffect(() => {
        const nextTopByNurseId: Record<string, number> = {};
        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const shouldSkipFlipAnimation = skipFlipAnimationOnceRef.current;

        sortedNurses.forEach((nurse) => {
            const rowElement = rowRefByNurseId.current[nurse.id];

            if (!rowElement) {
                return;
            }

            const nextTop = rowElement.getBoundingClientRect().top;
            const previousTop = previousTopByNurseIdRef.current[nurse.id];

            nextTopByNurseId[nurse.id] = nextTop;

            if (previousTop == null) {
                return;
            }

            const deltaY = previousTop - nextTop;

            if (Math.abs(deltaY) < 1) {
                return;
            }

            if (prefersReducedMotion || shouldSkipFlipAnimation) {
                return;
            }

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
    }, [sortedNurses]);

    return (
        <div className="space-y-4">
            <TeamTabs
                teams={draft.teams}
                nurses={draft.nurses}
                currentTeamId={selectedTeamId}
                onSelect={onSelectTeam}
                onAdd={onAddTeam}
                canAdd={canAddTeam}
                onRename={onTeamNameChange}
            />

            {hasNursesInSelectedTeam ? (
                <div className="flex items-center justify-end gap-3">
                    <div ref={sortMenuRef} className="relative">
                        <button
                            type="button"
                            aria-haspopup="listbox"
                            aria-expanded={isSortMenuOpen}
                            aria-label="간호사 정렬"
                            className={cn(
                                'flex h-8 min-w-[112px] items-center justify-between gap-3 rounded-[5px] bg-gray-6 px-3 font-apple text-[16px] text-gray-3 transition-colors focus-visible:outline-2 focus-visible:outline-main-1',
                                isSortMenuOpen ? 'bg-white shadow-[0px_10px_28px_rgba(95,100,135,0.16)]' : 'hover:bg-gray-7',
                            )}
                            onClick={() => setIsSortMenuOpen((prev) => !prev)}
                        >
                            <span>{selectedSortOption.label}</span>
                            <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', isSortMenuOpen && 'rotate-180')} />
                        </button>
                        {isSortMenuOpen ? (
                            <div
                                role="listbox"
                                aria-label="간호사 정렬 옵션"
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
                                                onSortModeChange(option.value);
                                                setIsSortMenuOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {hasNursesInSelectedTeam ? (
                <div
                    className={cn(
                        'grid items-center font-apple text-[16px] text-gray-3',
                        NURSE_GRID_GAP_CLASS,
                        NURSE_GRID_PADDING_X,
                        gridTemplateClass,
                    )}
                >
                    <div />
                    <div className="flex h-8 w-full items-center justify-center">
                        <span className="block w-full text-center">이름</span>
                    </div>
                    {showSkillColumn ? (
                        <div className="flex h-8 w-full items-center justify-center">
                            <span className="block w-full text-center">숙련도</span>
                        </div>
                    ) : null}
                    <div className="flex h-8 w-full items-center justify-center">
                        <span className="block w-full text-center">가능 근무</span>
                    </div>
                    <div className="flex h-8 w-full items-center justify-center">
                        <span className="block w-full text-center">프리셉터</span>
                    </div>
                    <div className="flex h-8 w-full items-center justify-center">
                        <span className="block w-full text-center">근무 투입</span>
                    </div>
                    <div />
                </div>
            ) : null}

            {hasNursesInSelectedTeam ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId={selectedTeamId}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                                {sortedNurses.map((nurse, index) => {
                                    const isSkillMenuOpen = openedSkillMenuNurseId === nurse.id;
                                    const isPreceptor = nurse.memo.trim() === '프리셉터';
                                    const isSkillUnselected = nurse.level == null;
                                    const skillBadgeLabel = isSkillUnselected ? SKILL_UNSELECTED_LABEL : getSkillLabel(nurse.level);
                                    const fadedClass = nurse.isWorker ? '' : 'opacity-45';

                                    return (
                                        <Draggable key={nurse.id} draggableId={nurse.id} index={index}>
                                            {(dragProvided) => (
                                                <div
                                                    ref={(element) => {
                                                        dragProvided.innerRef(element);
                                                        rowRefByNurseId.current[nurse.id] = element;
                                                    }}
                                                    {...dragProvided.draggableProps}
                                                    className={cn(
                                                        'grid items-center rounded-[12px] bg-white py-1.5',
                                                        NURSE_GRID_GAP_CLASS,
                                                        NURSE_GRID_PADDING_X,
                                                        gridTemplateClass,
                                                        isSkillMenuOpen && 'relative z-[1500]',
                                                        !nurse.isWorker && 'bg-[#FAFBFD]',
                                                    )}
                                                >
                                                    <button
                                                        type="button"
                                                        aria-label="드래그하여 순서 변경"
                                                        {...dragProvided.dragHandleProps}
                                                        className={cn(
                                                            'flex h-6 w-6 items-center justify-center text-gray-4 transition-colors hover:text-gray-3',
                                                            fadedClass,
                                                        )}
                                                    >
                                                        <SixDotsIcon className="h-4 w-4" />
                                                    </button>

                                                    <Input
                                                        value={nurse.name}
                                                        onChange={(event) =>
                                                            onNurseChange(nurse.id, {name: limitNurseNameInput(event.target.value)})
                                                        }
                                                        variant="flush"
                                                        fieldSize="default"
                                                        className={cn('text-center text-[16px] font-medium', fadedClass)}
                                                        placeholder="이름"
                                                        maxLength={MAX_ONBOARDING_NURSE_NAME_LENGTH}
                                                    />

                                                    {showSkillColumn ? (
                                                        <div
                                                            ref={isSkillMenuOpen ? skillMenuRef : null}
                                                            className="relative z-[1200] flex justify-center"
                                                        >
                                                            <button
                                                                type="button"
                                                                aria-haspopup="listbox"
                                                                aria-expanded={isSkillMenuOpen}
                                                                className="flex h-[24px] min-w-[94px] items-center justify-center gap-1 rounded-[6px] bg-transparent px-2"
                                                                onClick={() =>
                                                                    setOpenedSkillMenuNurseId((prev) => {
                                                                        const nextOpenedNurseId = prev === nurse.id ? null : nurse.id;

                                                                        return nextOpenedNurseId;
                                                                    })
                                                                }
                                                            >
                                                                <SkillBadge
                                                                    level={nurse.level}
                                                                    config={draft.skillLevelConfig}
                                                                    label={skillBadgeLabel}
                                                                    backgroundColor={
                                                                        isSkillUnselected ? SKILL_UNSELECTED_BACKGROUND : undefined
                                                                    }
                                                                    textColor={isSkillUnselected ? SKILL_UNSELECTED_TEXT : undefined}
                                                                    className="text-[12px]"
                                                                />
                                                                <ChevronDown
                                                                    className={cn(
                                                                        'h-3 w-3 text-gray-4 transition-transform',
                                                                        isSkillMenuOpen && 'rotate-180',
                                                                    )}
                                                                />
                                                            </button>
                                                            {isSkillMenuOpen ? (
                                                                <div
                                                                    role="listbox"
                                                                    aria-label={`${nurse.name || '간호사'} 숙련도`}
                                                                    className="absolute top-full left-1/2 z-[1300] mt-2 min-w-[120px] -translate-x-1/2 rounded-[10px] border border-gray-6 bg-white p-2 opacity-100 shadow-[0px_12px_28px_rgba(61,70,88,0.18)]"
                                                                >
                                                                    <div className="space-y-1.5">
                                                                        <button
                                                                            type="button"
                                                                            role="option"
                                                                            aria-selected={isSkillUnselected}
                                                                            className={cn(
                                                                                'flex w-full items-center justify-center rounded-[6px] px-2 py-1 text-[14px] transition-colors hover:bg-gray-7',
                                                                                isSkillUnselected && 'text-main-1',
                                                                            )}
                                                                            onClick={() => {
                                                                                onNurseChange(nurse.id, {level: null});
                                                                                setOpenedSkillMenuNurseId(null);
                                                                            }}
                                                                        >
                                                                            <SkillBadge
                                                                                level={null}
                                                                                config={draft.skillLevelConfig}
                                                                                label={SKILL_UNSELECTED_OPTION_LABEL}
                                                                                backgroundColor={SKILL_UNSELECTED_BACKGROUND}
                                                                                textColor={SKILL_UNSELECTED_TEXT}
                                                                                className="text-[12px]"
                                                                            />
                                                                        </button>
                                                                        {levelItems.map((level) => {
                                                                            const isSelected = nurse.level === level;

                                                                            return (
                                                                                <button
                                                                                    key={level}
                                                                                    type="button"
                                                                                    role="option"
                                                                                    aria-selected={isSelected}
                                                                                    className={cn(
                                                                                        'flex w-full items-center justify-center rounded-[6px] px-2 py-1 transition-colors hover:bg-gray-7',
                                                                                        isSelected && 'font-semibold',
                                                                                    )}
                                                                                    onClick={() => {
                                                                                        onNurseChange(nurse.id, {level});
                                                                                        setOpenedSkillMenuNurseId(null);
                                                                                    }}
                                                                                >
                                                                                    <SkillBadge
                                                                                        level={level}
                                                                                        config={draft.skillLevelConfig}
                                                                                        label={getSkillLabel(level)}
                                                                                        className="text-[12px]"
                                                                                    />
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    ) : null}

                                                    <div className={cn('flex flex-wrap items-center justify-center gap-1.5', fadedClass)}>
                                                        {activeShiftTypes.map((shiftType) => {
                                                            const selected = nurse.possibleShiftTypeIds.includes(shiftType.id);

                                                            return (
                                                                <button
                                                                    key={shiftType.id}
                                                                    type="button"
                                                                    aria-pressed={selected}
                                                                    className={cn(
                                                                        'group relative cursor-pointer rounded-[7px] p-[1px] transition-opacity duration-150 ease-out focus-visible:outline-2 focus-visible:outline-main-1/35',
                                                                        selected ? 'opacity-100' : 'opacity-55 hover:opacity-100',
                                                                    )}
                                                                    onClick={() => {
                                                                        const nextPossibleShiftTypeIds = selected
                                                                            ? nurse.possibleShiftTypeIds.filter(
                                                                                  (value) => value !== shiftType.id,
                                                                              )
                                                                            : [...nurse.possibleShiftTypeIds, shiftType.id];

                                                                        onNurseChange(nurse.id, {
                                                                            possibleShiftTypeIds: nextPossibleShiftTypeIds,
                                                                        });
                                                                    }}
                                                                >
                                                                    <ShiftBadge shiftType={shiftType} selected={selected} />
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className={cn('flex items-center justify-center', fadedClass)}>
                                                        <button
                                                            type="button"
                                                            role="checkbox"
                                                            aria-checked={isPreceptor}
                                                            aria-label={`${nurse.name || '간호사'} 프리셉터`}
                                                            className={cn(
                                                                'flex h-5 w-5 items-center justify-center rounded-[5px] border transition-colors focus-visible:outline-2 focus-visible:outline-main-1',
                                                                isPreceptor
                                                                    ? 'border-main-1 bg-main-1 text-white hover:bg-main-2'
                                                                    : 'border-sub-4 bg-white text-transparent hover:border-main-1 hover:bg-main-light',
                                                            )}
                                                            onClick={() => onNurseChange(nurse.id, {memo: isPreceptor ? '' : '프리셉터'})}
                                                        >
                                                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                                                        </button>
                                                    </div>

                                                    <div className={cn('flex items-center justify-center', fadedClass)}>
                                                        <Switch
                                                            checked={nurse.isWorker}
                                                            aria-label={`${nurse.name || '간호사'} 근무 투입`}
                                                            className="relative h-5 w-9 justify-start border-0 bg-sub-4 p-0 shadow-none data-[state=checked]:bg-main-1 data-[state=unchecked]:bg-sub-4"
                                                            thumbClassName="absolute top-0.5 left-0.5 h-4 w-4 translate-x-0 bg-white shadow-sm data-[state=checked]:translate-x-4"
                                                            onCheckedChange={(checked) => onNurseChange(nurse.id, {isWorker: checked})}
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        aria-label={`${nurse.name || '간호사'} 삭제`}
                                                        className={cn(
                                                            'flex h-7 w-7 items-center justify-center rounded-[7px] text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-1',
                                                            fadedClass,
                                                        )}
                                                        onClick={() => onDeleteNurse(nurse.id)}
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : null}

            <div className={cn('flex', hasNursesInSelectedTeam ? 'mt-2 justify-end' : 'mt-12 justify-center')}>
                <button
                    type="button"
                    className="group flex items-center gap-2 font-apple text-[16px] font-medium text-gray-3 transition-colors hover:text-[#4E586C]"
                    onClick={onAddNurse}
                >
                    <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-[#657084] transition-colors group-hover:bg-[#4E586C]">
                        <Plus className="h-[11px] w-[11px] text-white" />
                    </span>
                    간호사 추가하기
                </button>
            </div>
        </div>
    );
}

export default NurseStep;
