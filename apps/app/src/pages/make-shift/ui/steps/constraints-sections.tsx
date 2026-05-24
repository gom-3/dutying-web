import {cn} from '@dutying/utils/style';
import {Draggable, Droppable} from '@hello-pangea/dnd';
import {ChevronDown} from 'lucide-react';
import {type ReactNode} from 'react';
import {type TDutyRuleMeta, DUTY_RULE_META} from '@/features/shift-editor/model/duty-constraints';
import {type TDutyRuleKey} from '@/features/shift-editor/model/types';
import {SixDotsIcon} from '@/shared/assets/svg';
import {type useTypedTranslation} from '@/shared/hook/use-typed-translation';
import Select from '@/shared/ui/form-controls/Select';
import {ConstraintSectionInfo} from './constraints-section-info';

type TActiveBucket = 'error' | 'warning';
type TTypedT = ReturnType<typeof useTypedTranslation>['t'];

type TConstraintSectionProps = {
    title: string;
    countLabel: string;
    isOpen?: boolean;
    onToggle?: () => void;
    disabled?: boolean;
    infoLabel?: string;
    infoTooltipAria: string;
    children: ReactNode;
};

export function ConstraintSection({
    title,
    countLabel,
    isOpen,
    onToggle,
    disabled = false,
    infoLabel,
    infoTooltipAria,
    children,
}: TConstraintSectionProps) {
    const collapsible = typeof isOpen === 'boolean' && onToggle;

    return (
        <>
            <div className="make-shift-constraints__section-header flex min-h-[clamp(36px,3.0vw,46px)] items-center justify-between gap-[clamp(8px,0.7vw,14px)]">
                {collapsible ? (
                    <button
                        type="button"
                        className="make-shift-constraints__section-title flex min-w-0 items-center gap-[clamp(4px,0.5vw,8px)] font-apple text-[clamp(13px,1.2vw,21px)] font-bold text-sub-2 disabled:opacity-50"
                        onClick={onToggle}
                        disabled={disabled}
                    >
                        {title}
                        <ChevronDown
                            className={cn(
                                'size-[clamp(15px,1.25vw,21px)] shrink-0 transition-transform',
                                isOpen ? 'rotate-180' : 'rotate-0',
                            )}
                        />
                    </button>
                ) : (
                    <p className="make-shift-constraints__section-title font-apple text-[clamp(13px,1.2vw,21px)] font-bold text-gray-4">
                        {title}
                    </p>
                )}
                <div className="make-shift-constraints__section-meta flex shrink-0 items-center gap-[clamp(8px,0.65vw,12px)]">
                    <p className="make-shift-constraints__section-count font-apple text-[clamp(12px,1.05vw,17px)] font-semibold text-sub-2">
                        {countLabel}
                    </p>
                </div>
            </div>

            {collapsible && !isOpen ? null : (
                <div
                    className={cn(
                        'make-shift-constraints__section-body mt-[clamp(4px,0.45vw,8px)] rounded-[clamp(10px,1.0vw,15px)] bg-gray-7 px-[clamp(12px,1.8vw,26px)]',
                        infoLabel ? 'pt-[clamp(4px,0.35vw,7px)] pb-[clamp(8px,1.05vw,16px)]' : 'py-[clamp(8px,1.1vw,18px)]',
                    )}
                >
                    {infoLabel ? (
                        <div className="make-shift-constraints__section-body-info grid grid-cols-[clamp(22px,2.4vw,36px)_minmax(0,1fr)] items-center gap-x-[clamp(10px,1.1vw,20px)] pt-[clamp(5px,0.45vw,9px)] pb-[clamp(5px,0.45vw,9px)]">
                            <div aria-hidden className="w-full" />
                            <div className="flex min-w-0 justify-end">
                                <ConstraintSectionInfo label={infoLabel} ariaLabel={infoTooltipAria} />
                            </div>
                        </div>
                    ) : null}
                    {children}
                </div>
            )}
        </>
    );
}

export function renderRuleEditor(t: TTypedT, meta: TDutyRuleMeta, value: number | null, onChange: (next: number) => void) {
    if (!meta.valueField || !meta.valueOptions || meta.kind === 'noValue') return null;

    const options = meta.valueOptions.map((n) => ({value: n, label: n}));
    const select = (
        <Select
            value={value ?? ''}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            options={options}
            className="make-shift-constraints__rule-editor-select mx-[clamp(3px,0.3vw,5px)] h-[clamp(22px,1.85vw,30px)] w-[clamp(44px,4.2vw,60px)]"
            selectClassName="rounded-[5px] bg-main-light px-[clamp(6px,0.65vw,12px)] py-[clamp(2px,0.25vw,5px)] text-main-1 text-[clamp(10px,0.85vw,14px)]"
        />
    );
    const editorClass =
        'make-shift-constraints__rule-editor ml-[clamp(4px,0.5vw,8px)] flex items-center text-[clamp(13px,1.1vw,20px)] text-main-1 whitespace-nowrap';

    if (meta.kind === 'maxDays') {
        return (
            <div className={editorClass}>
                {t('page.makeShift.constraints.phrase.max')}
                {select}
                {t('page.makeShift.constraints.phrase.day')}
            </div>
        );
    }

    if (meta.kind === 'minDays') {
        return (
            <div className={editorClass}>
                {t('page.makeShift.constraints.phrase.min')}
                {select}
                {t('page.makeShift.constraints.phrase.day')}
            </div>
        );
    }

    if (meta.kind === 'daysOnly') {
        return (
            <div className={editorClass}>
                {select}
                {t('page.makeShift.constraints.phrase.day')}
            </div>
        );
    }

    return null;
}

type TConstraintBucketListProps = {
    t: TTypedT;
    bucket: TActiveBucket;
    ruleKeys: TDutyRuleKey[];
    ruleViolationCount: Map<string, number>;
    wardConstraint: Record<string, unknown> | null;
    onUpdateRuleValue: (meta: TDutyRuleMeta, nextValue: number) => void;
    onExcludeRule: (ruleKey: TDutyRuleKey) => void;
    disabled?: boolean;
};

export function ConstraintBucketList({
    t,
    bucket,
    ruleKeys,
    ruleViolationCount,
    wardConstraint,
    onUpdateRuleValue,
    onExcludeRule,
    disabled = false,
}: TConstraintBucketListProps) {
    return (
        <Droppable droppableId={bucket}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn('make-shift-constraints__bucket', `make-shift-constraints__bucket--${bucket}`)}
                >
                    {ruleKeys.length === 0 ? (
                        <div className="make-shift-constraints__empty rounded-[clamp(8px,0.7vw,10px)] bg-white px-[clamp(14px,1.5vw,24px)] py-[clamp(12px,1.25vw,20px)] text-center font-apple text-[clamp(10px,0.85vw,14px)] text-gray-4">
                            {t('page.makeShift.constraints.empty')}
                        </div>
                    ) : (
                        <div className="make-shift-constraints__rule-list flex flex-col gap-[clamp(8px,0.85vw,12px)]">
                            {ruleKeys.map((key, index) => {
                                const meta = DUTY_RULE_META[key];
                                const label = t(meta.labelKey);
                                const count = ruleViolationCount.get(`duty.${key}`) ?? 0;
                                const value = wardConstraint && meta.valueField ? (wardConstraint[meta.valueField] as number) : null;

                                return (
                                    <Draggable draggableId={key} index={index} key={key}>
                                        {(dragProvided, dragSnapshot) => (
                                            <div
                                                ref={dragProvided.innerRef}
                                                {...dragProvided.draggableProps}
                                                className={cn(
                                                    'make-shift-constraints__rule flex h-[clamp(28px,2.75vw,42px)] items-center gap-[clamp(10px,1.1vw,20px)]',
                                                    dragSnapshot.isDragging && 'opacity-95',
                                                )}
                                            >
                                                <div className="make-shift-constraints__rule-index w-[clamp(22px,2.4vw,36px)] text-center font-apple text-[clamp(14px,1.45vw,26px)] text-gray-4">
                                                    {index + 1}
                                                </div>
                                                <div className="make-shift-constraints__rule-card flex h-full min-h-0 flex-1 items-center rounded-[clamp(8px,0.7vw,10px)] bg-white px-[clamp(12px,1.3vw,20px)]">
                                                    <button
                                                        type="button"
                                                        aria-label={t('page.makeShift.constraints.dragHandleAria')}
                                                        className="make-shift-constraints__rule-drag-handle mr-[clamp(8px,0.85vw,16px)] cursor-grab active:cursor-grabbing"
                                                        {...dragProvided.dragHandleProps}
                                                    >
                                                        <SixDotsIcon className="size-[clamp(16px,1.5vw,24px)]" />
                                                    </button>
                                                    <div className="make-shift-constraints__rule-info min-w-0 flex-1">
                                                        <div className="flex items-center gap-[clamp(6px,0.65vw,12px)]">
                                                            <p className="make-shift-constraints__rule-label truncate font-apple text-[clamp(13px,1.1vw,20px)] font-medium text-sub-1">
                                                                {label}
                                                            </p>
                                                            {count > 0 ? (
                                                                <span className="make-shift-constraints__rule-violation-count rounded-full bg-main-light px-[clamp(4px,0.5vw,8px)] py-[clamp(1px,0.15vw,2px)] font-apple text-[clamp(9px,0.7vw,12px)] font-medium text-main-1">
                                                                    {t('page.makeShift.constraints.violationCount', {count})}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="make-shift-constraints__rule-editor-slot shrink-0">
                                                        {wardConstraint
                                                            ? renderRuleEditor(t, meta, value, (nextValue) =>
                                                                  onUpdateRuleValue(meta, nextValue),
                                                              )
                                                            : null}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        aria-label={t('page.makeShift.constraints.excludeRuleAria')}
                                                        title={t('page.makeShift.constraints.excludeRuleAria')}
                                                        className="make-shift-constraints__rule-exclude ml-[clamp(6px,0.6vw,10px)] inline-flex h-[clamp(24px,2.1vw,30px)] shrink-0 items-center gap-1 rounded-full bg-gray-7 px-[clamp(7px,0.75vw,10px)] font-apple text-[clamp(10px,0.85vw,12px)] font-semibold text-gray-4 transition-colors hover:bg-gray-6/60 hover:text-sub-1 disabled:opacity-40"
                                                        disabled={disabled}
                                                        onClick={() => onExcludeRule(key)}
                                                    >
                                                        <span>{t('page.makeShift.constraints.exclude')}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </div>
            )}
        </Droppable>
    );
}
