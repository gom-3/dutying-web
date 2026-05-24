import {Draggable, Droppable} from '@hello-pangea/dnd';
import {type ComponentProps} from 'react';
import {type TNurse} from '@/entities';
import SkillBadge from '@/features/ward-skill/ui/skill-badge';
import {type TGroupedDivisionNurses} from '@/pages/member/model/shift-team-list';
import {SixDotsIcon} from '@/shared/assets/svg';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import {Switch} from '@/shared/ui/primitives/switch';
import {formatNurseDisplayName} from './shared/format-nurse-display-name';

const SHIFT_TYPE_STYLE: Record<string, {bg: string; text: string}> = {
    D: {bg: '#4dc2ad', text: '#ffffff'},
    E: {bg: '#ff8ba5', text: '#ffffff'},
    N: {bg: '#3580ff', text: '#ffffff'},
    O: {bg: '#465b7a', text: '#ffffff'},
};
const WORKERS_GRID_TEMPLATE_COLUMNS_WITH_SKILL =
    'minmax(136px,1.2fr) clamp(58px,4.8vw,76px) clamp(128px,10vw,166px) clamp(66px,5vw,84px) clamp(74px,5.4vw,92px) minmax(116px,0.9fr)';
const WORKERS_GRID_TEMPLATE_COLUMNS_WITHOUT_SKILL =
    'minmax(136px,1.2fr) clamp(128px,10vw,166px) clamp(66px,5vw,84px) clamp(74px,5.4vw,92px) minmax(116px,0.9fr)';
const WORKERS_GRID_GAP = 'gap-[clamp(8px,0.85vw,14px)]';
const WORKERS_ROW_PADDING_X = 'px-[clamp(12px,1.2vw,18px)]';
const MEMO_PREVIEW_LENGTH = 20;

type TSkillConfig = ComponentProps<typeof SkillBadge>['config'];

function ShiftTypeBadge({code}: {code: string}) {
    const style = SHIFT_TYPE_STYLE[code] ?? {bg: '#939ba9', text: '#ffffff'};

    return (
        <div
            className="make-shift-workers__shift-type-badge flex size-[clamp(14px,1.2vw,19px)] shrink-0 items-center justify-center rounded-[clamp(3px,0.35vw,5px)] font-apple text-[clamp(9px,0.82vw,14px)] font-medium"
            style={{backgroundColor: style.bg, color: style.text}}
        >
            {code}
        </div>
    );
}

export function buildShiftCodes(nurse: TNurse) {
    return nurse.nurseShiftTypes
        .filter((shift) => shift.isPossible)
        .map((shift) => shift.shortName || shift.name)
        .map((name) => name.trim().toUpperCase())
        .filter((code) => code.length > 0);
}

function getWorkerGridTemplateColumns(showSkill: boolean) {
    return showSkill ? WORKERS_GRID_TEMPLATE_COLUMNS_WITH_SKILL : WORKERS_GRID_TEMPLATE_COLUMNS_WITHOUT_SKILL;
}

function formatMemoPreview(memo: string) {
    return memo.length > MEMO_PREVIEW_LENGTH ? `${memo.slice(0, MEMO_PREVIEW_LENGTH)}...` : memo;
}

export function WorkersTableHeader({showSkill}: {showSkill: boolean}) {
    const {t} = useTypedTranslation();

    return (
        <div
            className={`make-shift-workers__table-header grid h-8 items-center ${WORKERS_GRID_GAP} ${WORKERS_ROW_PADDING_X} font-apple text-[12px] font-semibold text-gray-4`}
            style={{gridTemplateColumns: getWorkerGridTemplateColumns(showSkill)}}
        >
            <p className="make-shift-workers__col-label make-shift-workers__col-label--name text-left">
                {t('page.makeShift.workers.column.name')}
            </p>
            {showSkill ? (
                <p className="make-shift-workers__col-label make-shift-workers__col-label--level text-center">
                    {t('page.makeShift.workers.column.level')}
                </p>
            ) : null}
            <p className="make-shift-workers__col-label make-shift-workers__col-label--shift-types text-center">
                {t('page.makeShift.workers.column.shiftTypes')}
            </p>
            <p className="make-shift-workers__col-label make-shift-workers__col-label--preceptor text-center">
                {t('page.makeShift.workers.column.preceptor')}
            </p>
            <p className="make-shift-workers__col-label make-shift-workers__col-label--is-worker text-center">
                {t('page.makeShift.workers.column.isWorker')}
            </p>
            <p className="make-shift-workers__col-label make-shift-workers__col-label--memo text-center">
                {t('page.makeShift.workers.column.memo')}
            </p>
        </div>
    );
}

type TWorkersListProps = {
    grouped: TGroupedDivisionNurses;
    shiftTeamId: number;
    levelsByNurseId: Record<number, number>;
    skillConfig: TSkillConfig;
    isBusy: boolean;
    getWorkerState: (nurse: TNurse) => boolean;
    onToggleWorker: (nurse: TNurse, checked: boolean) => void;
    setRowRef: (nurseId: number, element: HTMLDivElement | null) => void;
};

export function WorkersList({
    grouped,
    shiftTeamId,
    levelsByNurseId,
    skillConfig,
    isBusy,
    getWorkerState,
    onToggleWorker,
    setRowRef,
}: TWorkersListProps) {
    const showSkill = skillConfig.enabled;

    return (
        <div className="make-shift-workers__list-wrapper mt-2 flex flex-col gap-2">
            {grouped.map(([division, divisionWorkers]) => (
                <div key={`${shiftTeamId},${division}`} className="make-shift-workers__division-block">
                    <Droppable droppableId={`${shiftTeamId},${division}`}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="make-shift-workers__list flex flex-col gap-1.5"
                            >
                                {divisionWorkers.map((nurse, index) => (
                                    <WorkerRow
                                        key={nurse.nurseId}
                                        nurse={nurse}
                                        index={index}
                                        level={levelsByNurseId[nurse.nurseId]}
                                        skillConfig={skillConfig}
                                        showSkill={showSkill}
                                        isWorker={getWorkerState(nurse)}
                                        isBusy={isBusy}
                                        onToggleWorker={onToggleWorker}
                                        setRowRef={setRowRef}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            ))}
        </div>
    );
}

type TWorkerRowProps = {
    nurse: TNurse;
    index: number;
    level: number | undefined;
    skillConfig: TSkillConfig;
    showSkill: boolean;
    isWorker: boolean;
    isBusy: boolean;
    onToggleWorker: (nurse: TNurse, checked: boolean) => void;
    setRowRef: (nurseId: number, element: HTMLDivElement | null) => void;
};

function WorkerRow({nurse, index, level, skillConfig, showSkill, isWorker, isBusy, onToggleWorker, setRowRef}: TWorkerRowProps) {
    const {t} = useTypedTranslation();
    const shiftCodes = buildShiftCodes(nurse);
    const memo = nurse.memo?.trim();
    const memoPreview = memo ? formatMemoPreview(memo) : '';
    const fadedClass = isWorker ? '' : 'opacity-55';

    return (
        <Draggable draggableId={String(nurse.nurseId)} index={index} isDragDisabled={!isWorker}>
            {(dragProvided, dragSnapshot) => {
                const {style: dragStyle, ...draggableProps} = dragProvided.draggableProps;

                return (
                    <div
                        ref={(element) => {
                            dragProvided.innerRef(element);
                            setRowRef(nurse.nurseId, element);
                        }}
                        {...draggableProps}
                        className={`make-shift-workers__row grid min-h-11 items-center rounded-[12px] bg-white ${WORKERS_GRID_GAP} ${WORKERS_ROW_PADDING_X} transition-colors hover:bg-[#FBFDFF] ${
                            dragSnapshot.isDragging ? 'opacity-95' : ''
                        }`}
                        style={{
                            ...(dragStyle ?? {}),
                            gridTemplateColumns: getWorkerGridTemplateColumns(showSkill),
                        }}
                    >
                        <div className="make-shift-workers__row-name flex min-w-0 items-center gap-3 pl-1">
                            <button
                                type="button"
                                aria-label={t('page.makeShift.workers.dragHandleAria')}
                                disabled={!isWorker}
                                className={`make-shift-workers__row-drag-handle grid size-8 shrink-0 place-items-center rounded-[9px] text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-2 focus-visible:ring-2 focus-visible:ring-main-1/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-35 ${
                                    isWorker ? 'cursor-grab active:cursor-grabbing' : ''
                                }`}
                                {...dragProvided.dragHandleProps}
                            >
                                <SixDotsIcon className="size-[clamp(13px,1.25vw,18px)]" />
                            </button>
                            <p
                                className={`min-w-0 truncate text-left font-apple text-[clamp(12px,1.1vw,18px)] font-semibold whitespace-nowrap text-sub-1 ${fadedClass}`}
                                title={nurse.name}
                            >
                                {formatNurseDisplayName(nurse.name)}
                            </p>
                        </div>
                        {showSkill ? (
                            <div className={`make-shift-workers__row-level flex justify-center ${fadedClass}`}>
                                <SkillBadge
                                    level={level}
                                    config={skillConfig}
                                    className="make-shift-workers__skill-badge h-[clamp(14px,1.25vw,18px)] min-w-[clamp(28px,3.0vw,40px)] text-[clamp(9px,0.82vw,13px)]"
                                />
                            </div>
                        ) : null}
                        <div
                            className={`make-shift-workers__row-shift-types flex items-center justify-center gap-[clamp(3px,0.3vw,6px)] ${fadedClass}`}
                        >
                            {shiftCodes.length > 0 ? (
                                shiftCodes.map((code) => <ShiftTypeBadge key={`${nurse.nurseId}-${code}`} code={code} />)
                            ) : (
                                <span className="font-apple text-[clamp(10px,0.85vw,14px)] text-gray-4">-</span>
                            )}
                        </div>
                        <div className={`make-shift-workers__row-preceptor flex items-center justify-center ${fadedClass}`}>
                            {nurse.isWardManager ? (
                                <span className="inline-flex h-6 items-center rounded-full bg-main-light px-2.5 font-apple text-[12px] font-semibold text-main-1">
                                    {t('page.makeShift.workers.preceptorActive')}
                                </span>
                            ) : (
                                <span className="text-[clamp(10px,0.85vw,14px)] font-normal text-gray-4">-</span>
                            )}
                        </div>
                        <div className={`make-shift-workers__row-is-worker flex justify-center ${fadedClass}`}>
                            <Switch
                                checked={isWorker}
                                disabled={isBusy}
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                                onCheckedChange={(checked) => onToggleWorker(nurse, checked)}
                                className="relative h-5 w-9 justify-start border-0 bg-sub-4 p-0 shadow-none data-[state=checked]:bg-main-1 data-[state=unchecked]:bg-sub-4"
                                thumbClassName="absolute top-0.5 left-0.5 h-4 w-4 translate-x-0 bg-white shadow-sm data-[state=checked]:translate-x-4"
                                aria-label={`${nurse.name} ${t('page.makeShift.workers.column.isWorker')}`}
                            />
                        </div>
                        <div className={`make-shift-workers__row-memo flex min-w-0 items-center justify-center ${fadedClass}`}>
                            {memo ? (
                                <p
                                    className="min-w-0 truncate text-center font-apple text-[clamp(12px,1.1vw,18px)] font-medium text-sub-1"
                                    title={memo}
                                >
                                    {memoPreview}
                                </p>
                            ) : (
                                <span className="text-[clamp(10px,0.85vw,14px)] font-normal text-gray-4">-</span>
                            )}
                        </div>
                    </div>
                );
            }}
        </Draggable>
    );
}
