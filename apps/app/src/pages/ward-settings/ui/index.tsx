import {type TCreateShiftTypeDTO} from '@dutying/api/ward';
import {cn} from '@dutying/utils/style';
import {Check, CircleAlert, Plus, X} from 'lucide-react';
import {type ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import {Constraints as ShiftConstraintRules} from '@/pages/make-shift/ui/steps/constraints';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import PageState from '@/shared/ui/PageState';
import {Input} from '@/shared/ui/primitives/input';
import {formatShiftDuration} from '../model/utils';
import {
    type TWardSettingsActions,
    type TWardSettingsShiftType,
    type TWardSettingsState,
    type TWardSettingsTab,
} from '../model/ward-settings-hook';

type TWardSettingsPageViewProps = {
    state: TWardSettingsState;
    actions: TWardSettingsActions;
};

const TAB_ORDER: TWardSettingsTab[] = ['shiftTypes', 'constraints'];
const PASTEL_SHIFT_COLORS = [
    '#9AD7CB',
    '#F3A9B9',
    '#8FB7FF',
    '#9AA8C7',
    '#F4C6A8',
    '#F7D98F',
    '#C7D98B',
    '#9ED8E8',
    '#CBB8F3',
    '#F2B3DE',
] as const;
const SHIFT_TYPE_GRID_COLS = 'grid-cols-[minmax(130px,1.2fr)_56px_112px_minmax(230px,1.45fr)_48px_40px]';
const SHIFT_TYPE_INPUT_SURFACE_CLASS =
    'rounded-[10px] border-0 bg-gray-7 ring-1 ring-transparent transition-[background-color,box-shadow] duration-150 ease-out hover:bg-gray-6/50 focus-visible:border-0 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-main-1/70';
const SHIFT_TYPE_INPUT_ERROR_CLASS =
    'bg-[#FFF7F8] ring-1 ring-red/45 focus-visible:border-0 focus-visible:bg-white focus-visible:ring-red/70';
const SHIFT_NAME_MAX_LENGTH = 12;
const SHIFT_TIME_FORMAT_REGEX = /^\d{2}:\d{2}$/;

function toShiftTypeUpdateDTO(shiftType: TWardSettingsShiftType): TCreateShiftTypeDTO {
    return {
        name: shiftType.name,
        shortName: shiftType.shortName,
        startTime: shiftType.startTime,
        endTime: shiftType.endTime,
        color: shiftType.color,
        isDefault: shiftType.isDefault,
        isOff: shiftType.isOff,
        isCounted: shiftType.isCounted,
        classification: shiftType.isOff ? 'OTHER_LEAVE' : 'OTHER_WORK',
    };
}

function parseShiftTimeToMinutes(value: string) {
    if (!SHIFT_TIME_FORMAT_REGEX.test(value)) return null;

    const [hour, minute] = value.split(':').map(Number);

    if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

    return hour * 60 + minute;
}

function normalizeShiftTimeInput(value: string) {
    const trimmed = value.trim();

    if (!trimmed) return '';

    if (trimmed.includes(':')) {
        const [rawHour = '', rawMinute = ''] = trimmed.split(':');
        const hourDigits = rawHour.replace(/\D/g, '').slice(0, 2);
        const minuteDigits = rawMinute.replace(/\D/g, '').slice(0, 2);

        if (!hourDigits && !minuteDigits) return '';

        if (!minuteDigits) return hourDigits;

        return `${hourDigits}:${minuteDigits}`;
    }

    const digits = trimmed.replace(/\D/g, '').slice(0, 4);

    if (!digits) return '';

    if (digits.length <= 2) return digits;

    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function toCanonicalShiftTime(value: string) {
    const normalized = normalizeShiftTimeInput(value);
    const fullMinutes = parseShiftTimeToMinutes(normalized);

    if (fullMinutes != null) {
        const hour = String(Math.floor(fullMinutes / 60)).padStart(2, '0');
        const minute = String(fullMinutes % 60).padStart(2, '0');

        return `${hour}:${minute}`;
    }

    const partialMatch = normalized.match(/^(\d{1,2}):(\d{1,2})$/);

    if (!partialMatch) return normalized;

    const hour = Number(partialMatch[1]);
    const minute = Number(partialMatch[2]);

    if (!Number.isInteger(hour) || !Number.isInteger(minute)) return normalized;

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return normalized;

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function Tabs({currentTab, onSelect}: {currentTab: TWardSettingsTab; onSelect: (tab: TWardSettingsTab) => void}) {
    const {t} = useTypedTranslation();

    return (
        <div className="w-fit rounded-[12px] bg-gray-7 p-1">
            <div className="flex items-center gap-1">
                {TAB_ORDER.map((tab) => {
                    const active = currentTab === tab;

                    return (
                        <button
                            key={tab}
                            type="button"
                            className={cn(
                                'rounded-[9px] px-3 py-2 font-apple text-sm font-semibold transition-colors',
                                active ? 'bg-white text-sub-1' : 'text-gray-3 hover:text-sub-1',
                            )}
                            onClick={() => onSelect(tab)}
                        >
                            {t(`page.wardSettings.tabs.${tab}`)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function InlineFieldError({id, children}: {id?: string; children: ReactNode}) {
    return (
        <p
            id={id}
            className="mt-1 flex items-center justify-center gap-1 font-apple text-[11px] leading-none whitespace-nowrap text-red transition-opacity duration-150"
            role="alert"
        >
            <CircleAlert className="h-3 w-3" aria-hidden="true" />
            {children}
        </p>
    );
}

function ShiftTypeTable({
    shiftTypes,
    onCreate,
    onUpdate,
    onDelete,
    onRetry,
    status,
}: {
    shiftTypes: TWardSettingsShiftType[];
    status: TWardSettingsState['shiftTypesStatus'];
    onCreate: (payload: TCreateShiftTypeDTO) => Promise<void>;
    onUpdate: (shiftType: TWardSettingsShiftType) => Promise<void>;
    onDelete: (shiftTypeId: number) => Promise<void>;
    onRetry: () => void;
}) {
    const {t} = useTypedTranslation();
    const [openedColorShiftTypeId, setOpenedColorShiftTypeId] = useState<number | null>(null);
    const [shortNameErrorById, setShortNameErrorById] = useState<Record<number, string>>({});
    const [showValidationHighlight, setShowValidationHighlight] = useState(false);
    const [draftShiftTypes, setDraftShiftTypes] = useState<TWardSettingsShiftType[]>([]);
    const [deletedShiftTypeIds, setDeletedShiftTypeIds] = useState<number[]>([]);
    const openedColorContainerRef = useRef<HTMLDivElement | null>(null);
    const tempShiftTypeIdRef = useRef(-1);

    useEffect(() => {
        setDraftShiftTypes(shiftTypes);
        setDeletedShiftTypeIds([]);
        setShowValidationHighlight(false);
    }, [shiftTypes]);

    const duplicatedShiftNames = useMemo(() => {
        const countByName = new Map<string, number>();

        draftShiftTypes.forEach((shiftType) => {
            const normalizedName = shiftType.name.trim().toLocaleLowerCase();

            if (!normalizedName) return;

            countByName.set(normalizedName, (countByName.get(normalizedName) ?? 0) + 1);
        });

        return new Set(
            Array.from(countByName.entries())
                .filter(([, count]) => count > 1)
                .map(([name]) => name),
        );
    }, [draftShiftTypes]);
    const duplicatedShiftShortNames = useMemo(() => {
        const countByShortName = new Map<string, number>();

        draftShiftTypes.forEach((shiftType) => {
            const normalizedShortName = shiftType.shortName.trim().toLocaleUpperCase();

            if (!normalizedShortName) return;

            countByShortName.set(normalizedShortName, (countByShortName.get(normalizedShortName) ?? 0) + 1);
        });

        return new Set(
            Array.from(countByShortName.entries())
                .filter(([, count]) => count > 1)
                .map(([shortName]) => shortName),
        );
    }, [draftShiftTypes]);

    useEffect(() => {
        if (!openedColorShiftTypeId) return;

        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;

            if (openedColorContainerRef.current?.contains(target)) return;

            setOpenedColorShiftTypeId(null);
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [openedColorShiftTypeId]);

    const patchDraft = (shiftTypeId: number, updater: Partial<TWardSettingsShiftType>) => {
        setDraftShiftTypes((prev) => prev.map((item) => (item.wardShiftTypeId === shiftTypeId ? {...item, ...updater} : item)));
    };
    const getShiftNameError = (name: string) => {
        const normalizedName = name.trim().toLocaleLowerCase();

        if (!normalizedName) return '근무명을 입력해 주세요.';

        if (duplicatedShiftNames.has(normalizedName)) return '다른 근무명을 입력해 주세요.';

        return null;
    };
    const getShiftShortNameError = (shiftTypeId: number, shortName: string) => {
        if (shortNameErrorById[shiftTypeId]) return shortNameErrorById[shiftTypeId];

        const normalizedShortName = shortName.trim().toLocaleUpperCase();

        if (!normalizedShortName) return '약자를 입력해 주세요.';

        if (duplicatedShiftShortNames.has(normalizedShortName)) return '다른 약자를 입력해 주세요.';

        return null;
    };
    const getShiftTimeError = (shiftType: TWardSettingsShiftType) => {
        if (shiftType.isOff) return null;

        const normalizedStartTime = shiftType.startTime.trim();
        const normalizedEndTime = shiftType.endTime.trim();

        if (!normalizedStartTime || !normalizedEndTime) return '시간을 입력해 주세요.';

        const startMinutes = parseShiftTimeToMinutes(normalizedStartTime);
        const endMinutes = parseShiftTimeToMinutes(normalizedEndTime);

        if (startMinutes == null || endMinutes == null) return '시간은 00:00 형식으로 입력해 주세요.';

        if (endMinutes === startMinutes) return '시작/종료 시간을 다르게 입력해 주세요.';

        return null;
    };
    const hasRowValidationError = (shiftType: TWardSettingsShiftType) =>
        Boolean(
            getShiftNameError(shiftType.name) ??
                getShiftShortNameError(shiftType.wardShiftTypeId, shiftType.shortName) ??
                getShiftTimeError(shiftType),
        );
    const hasAnyValidationError = draftShiftTypes.some(hasRowValidationError);
    const addDraftShiftType = () => {
        const nextTempId = tempShiftTypeIdRef.current--;

        setDraftShiftTypes((prev) => [
            ...prev,
            {
                wardShiftTypeId: nextTempId,
                name: '새 근무',
                shortName: 'W',
                startTime: '09:00',
                endTime: '18:00',
                color: '#9AD7CB',
                isDefault: false,
                isOff: false,
                isCounted: true,
                classification: 'OTHER_WORK',
            },
        ]);
    };
    const removeDraftShiftType = (shiftTypeId: number) => {
        setDraftShiftTypes((prev) => prev.filter((shiftType) => shiftType.wardShiftTypeId !== shiftTypeId));

        if (shiftTypeId > 0) {
            setDeletedShiftTypeIds((prev) => (prev.includes(shiftTypeId) ? prev : [...prev, shiftTypeId]));
        }
    };
    const saveAllShiftTypes = async () => {
        setShowValidationHighlight(true);

        if (hasAnyValidationError) {
            const firstInvalid = draftShiftTypes.find(hasRowValidationError);

            if (!firstInvalid) return;

            const firstTargetSelector = (() => {
                if (getShiftNameError(firstInvalid.name)) return `[data-shift-name-input="${firstInvalid.wardShiftTypeId}"]`;

                if (getShiftShortNameError(firstInvalid.wardShiftTypeId, firstInvalid.shortName))
                    return `[data-shift-shortname-input="${firstInvalid.wardShiftTypeId}"]`;

                if (getShiftTimeError(firstInvalid)) return `[data-shift-start-input="${firstInvalid.wardShiftTypeId}"]`;

                return null;
            })();

            if (!firstTargetSelector) return;

            const target = document.querySelector<HTMLInputElement>(firstTargetSelector);

            if (!target) return;

            target.focus();
            target.scrollIntoView({block: 'center', behavior: 'smooth'});

            return;
        }

        for (const shiftTypeId of deletedShiftTypeIds) {
            await onDelete(shiftTypeId);
        }

        for (const shiftType of draftShiftTypes) {
            if (shiftType.wardShiftTypeId < 0) {
                await onCreate(toShiftTypeUpdateDTO(shiftType));
                continue;
            }

            await onUpdate(shiftType);
        }
    };

    if (status === 'pending') {
        return (
            <div className="rounded-[10px] bg-white">
                <PageState tone="loading" title={t('page.wardSettings.shiftTypes.loading')} className="py-0" />
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="rounded-[10px] bg-white">
                <PageState
                    tone="error"
                    title={t('page.wardSettings.shiftTypes.error')}
                    description={t('page.state.errorDescription')}
                    action={{label: t('page.state.retry'), onClick: () => void onRetry()}}
                    className="py-0"
                />
            </div>
        );
    }

    if (draftShiftTypes.length === 0) {
        return (
            <div className="rounded-[10px] bg-white">
                <PageState tone="empty" title={t('page.wardSettings.shiftTypes.empty')} className="py-0">
                    <div className="mt-1 flex justify-center">
                        <button
                            type="button"
                            className="flex items-center gap-1 font-apple text-base font-medium text-gray-3"
                            onClick={addDraftShiftType}
                        >
                            <Plus className="h-5 w-5" />
                            {t('page.wardSettings.addShiftType')}
                        </button>
                    </div>
                </PageState>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[960px]">
            <div className="overflow-x-auto">
                <div className="min-w-[780px]">
                    <div
                        className={`mb-2 grid ${SHIFT_TYPE_GRID_COLS} items-center gap-4 px-3 text-center font-apple text-[13px] font-medium text-gray-3`}
                    >
                        <span>{t('page.wardSettings.shiftTypes.column.name')}</span>
                        <span>{t('page.wardSettings.shiftTypes.column.shortName')}</span>
                        <span>{t('page.wardSettings.shiftTypes.column.type')}</span>
                        <span className="-ml-5">{t('page.wardSettings.shiftTypes.column.workTime')}</span>
                        <span className="-ml-4">{t('page.wardSettings.shiftTypes.column.color')}</span>
                        <span />
                    </div>
                    <div className="overflow-hidden rounded-[16px] bg-white px-1 py-1">
                        {draftShiftTypes.map((shiftType) => (
                            <div key={shiftType.wardShiftTypeId} className={`grid ${SHIFT_TYPE_GRID_COLS} items-start gap-4 px-3 py-3`}>
                                <div className="flex flex-col gap-1">
                                    <Input
                                        data-shift-name-input={shiftType.wardShiftTypeId}
                                        value={shiftType.name}
                                        maxLength={SHIFT_NAME_MAX_LENGTH}
                                        onChange={(event) => patchDraft(shiftType.wardShiftTypeId, {name: event.target.value})}
                                        variant="foundation"
                                        fieldSize="lg"
                                        aria-invalid={showValidationHighlight && Boolean(getShiftNameError(shiftType.name))}
                                        aria-describedby={
                                            showValidationHighlight && getShiftNameError(shiftType.name)
                                                ? `shift-name-error-${shiftType.wardShiftTypeId}`
                                                : undefined
                                        }
                                        className={cn(
                                            `mx-auto w-full text-center font-apple text-[15px] ${SHIFT_TYPE_INPUT_SURFACE_CLASS}`,
                                            showValidationHighlight && getShiftNameError(shiftType.name)
                                                ? SHIFT_TYPE_INPUT_ERROR_CLASS
                                                : '',
                                        )}
                                        placeholder="근무명"
                                    />
                                    {showValidationHighlight && getShiftNameError(shiftType.name) ? (
                                        <InlineFieldError id={`shift-name-error-${shiftType.wardShiftTypeId}`}>
                                            {getShiftNameError(shiftType.name)}
                                        </InlineFieldError>
                                    ) : null}
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <Input
                                        data-shift-shortname-input={shiftType.wardShiftTypeId}
                                        value={shiftType.shortName}
                                        maxLength={1}
                                        onChange={(event) => {
                                            const upper = event.target.value.toUpperCase();
                                            const alphaOnly = upper.replace(/[^A-Z]/g, '').slice(0, 1);

                                            if (upper !== alphaOnly) {
                                                setShortNameErrorById((prev) => ({
                                                    ...prev,
                                                    [shiftType.wardShiftTypeId]: '영문 1글자만 입력해 주세요.',
                                                }));
                                            } else {
                                                setShortNameErrorById((prev) => ({...prev, [shiftType.wardShiftTypeId]: ''}));
                                            }

                                            patchDraft(shiftType.wardShiftTypeId, {shortName: alphaOnly});
                                        }}
                                        variant="foundation"
                                        fieldSize="lg"
                                        aria-invalid={
                                            showValidationHighlight &&
                                            Boolean(getShiftShortNameError(shiftType.wardShiftTypeId, shiftType.shortName))
                                        }
                                        aria-describedby={
                                            showValidationHighlight &&
                                            getShiftShortNameError(shiftType.wardShiftTypeId, shiftType.shortName)
                                                ? `shift-short-name-error-${shiftType.wardShiftTypeId}`
                                                : undefined
                                        }
                                        className={cn(
                                            `h-10 w-10 px-0 text-center font-poppins text-[15px] ${SHIFT_TYPE_INPUT_SURFACE_CLASS}`,
                                            showValidationHighlight &&
                                                getShiftShortNameError(shiftType.wardShiftTypeId, shiftType.shortName)
                                                ? SHIFT_TYPE_INPUT_ERROR_CLASS
                                                : '',
                                        )}
                                        placeholder="-"
                                    />
                                    {showValidationHighlight && getShiftShortNameError(shiftType.wardShiftTypeId, shiftType.shortName) ? (
                                        <InlineFieldError id={`shift-short-name-error-${shiftType.wardShiftTypeId}`}>
                                            {getShiftShortNameError(shiftType.wardShiftTypeId, shiftType.shortName)}
                                        </InlineFieldError>
                                    ) : null}
                                </div>
                                <div className="mx-auto flex h-10 w-full max-w-[112px] items-center rounded-[10px] bg-gray-7 p-1">
                                    <button
                                        type="button"
                                        className={cn(
                                            'h-full flex-1 rounded-[8px] font-apple text-[13px] leading-none font-semibold transition-colors',
                                            !shiftType.isOff ? 'bg-white text-sub-1' : 'bg-transparent text-gray-3',
                                        )}
                                        onClick={() => {
                                            if (!shiftType.isOff) return;

                                            const next = {
                                                ...shiftType,
                                                isOff: false,
                                                classification: 'OTHER_WORK' as const,
                                                startTime: shiftType.startTime || '09:00',
                                                endTime: shiftType.endTime || '18:00',
                                            };

                                            patchDraft(shiftType.wardShiftTypeId, next);
                                        }}
                                    >
                                        근무
                                    </button>
                                    <button
                                        type="button"
                                        className={cn(
                                            'h-full flex-1 rounded-[8px] font-apple text-[13px] leading-none font-semibold transition-colors',
                                            shiftType.isOff ? 'bg-white text-sub-1' : 'bg-transparent text-gray-3',
                                        )}
                                        onClick={() => {
                                            if (shiftType.isOff) return;

                                            const next = {
                                                ...shiftType,
                                                isOff: true,
                                                classification: 'OTHER_LEAVE' as const,
                                                startTime: '',
                                                endTime: '',
                                            };

                                            patchDraft(shiftType.wardShiftTypeId, next);
                                        }}
                                    >
                                        휴무
                                    </button>
                                </div>
                                <div className="ml-[12px] flex justify-center self-center">
                                    <div className="flex items-center">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    data-shift-start-input={shiftType.wardShiftTypeId}
                                                    value={shiftType.isOff ? '-' : shiftType.startTime}
                                                    disabled={shiftType.isOff}
                                                    onChange={(event) =>
                                                        patchDraft(shiftType.wardShiftTypeId, {
                                                            startTime: normalizeShiftTimeInput(event.target.value),
                                                        })
                                                    }
                                                    onBlur={(event) => {
                                                        patchDraft(shiftType.wardShiftTypeId, {
                                                            startTime: toCanonicalShiftTime(event.target.value),
                                                        });
                                                    }}
                                                    variant="foundation"
                                                    fieldSize="lg"
                                                    aria-invalid={showValidationHighlight && Boolean(getShiftTimeError(shiftType))}
                                                    aria-describedby={
                                                        showValidationHighlight && getShiftTimeError(shiftType)
                                                            ? `shift-time-error-${shiftType.wardShiftTypeId}`
                                                            : undefined
                                                    }
                                                    className={cn(
                                                        `h-10 text-center font-poppins text-[15px] ${SHIFT_TYPE_INPUT_SURFACE_CLASS}`,
                                                        showValidationHighlight && getShiftTimeError(shiftType)
                                                            ? SHIFT_TYPE_INPUT_ERROR_CLASS
                                                            : '',
                                                    )}
                                                    placeholder="07:00"
                                                />
                                                <span className="font-poppins text-[15px] text-gray-3">~</span>
                                                <Input
                                                    data-shift-end-input={shiftType.wardShiftTypeId}
                                                    value={shiftType.isOff ? '-' : shiftType.endTime}
                                                    disabled={shiftType.isOff}
                                                    onChange={(event) =>
                                                        patchDraft(shiftType.wardShiftTypeId, {
                                                            endTime: normalizeShiftTimeInput(event.target.value),
                                                        })
                                                    }
                                                    onBlur={(event) => {
                                                        patchDraft(shiftType.wardShiftTypeId, {
                                                            endTime: toCanonicalShiftTime(event.target.value),
                                                        });
                                                    }}
                                                    variant="foundation"
                                                    fieldSize="lg"
                                                    aria-invalid={showValidationHighlight && Boolean(getShiftTimeError(shiftType))}
                                                    aria-describedby={
                                                        showValidationHighlight && getShiftTimeError(shiftType)
                                                            ? `shift-time-error-${shiftType.wardShiftTypeId}`
                                                            : undefined
                                                    }
                                                    className={cn(
                                                        `h-10 text-center font-poppins text-[15px] ${SHIFT_TYPE_INPUT_SURFACE_CLASS}`,
                                                        showValidationHighlight && getShiftTimeError(shiftType)
                                                            ? SHIFT_TYPE_INPUT_ERROR_CLASS
                                                            : '',
                                                    )}
                                                    placeholder="15:00"
                                                />
                                            </div>
                                            {showValidationHighlight && getShiftTimeError(shiftType) ? (
                                                <InlineFieldError id={`shift-time-error-${shiftType.wardShiftTypeId}`}>
                                                    {getShiftTimeError(shiftType)}
                                                </InlineFieldError>
                                            ) : null}
                                        </div>
                                        <span className="ml-2 flex h-10 min-w-[52px] items-center font-poppins text-[11px] leading-none whitespace-nowrap text-gray-4">
                                            {shiftType.isOff ? '' : formatShiftDuration(shiftType.startTime, shiftType.endTime)}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="relative flex justify-center self-center"
                                    ref={openedColorShiftTypeId === shiftType.wardShiftTypeId ? openedColorContainerRef : null}
                                >
                                    <button
                                        type="button"
                                        aria-label={`${shiftType.name || '근무'} 색상 선택`}
                                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] bg-gray-7"
                                        onClick={() =>
                                            setOpenedColorShiftTypeId((prev) =>
                                                prev === shiftType.wardShiftTypeId ? null : shiftType.wardShiftTypeId,
                                            )
                                        }
                                    >
                                        <span className="h-6 w-6 rounded-[7px]" style={{backgroundColor: shiftType.color}} />
                                    </button>
                                    {openedColorShiftTypeId === shiftType.wardShiftTypeId ? (
                                        <div className="absolute top-full left-1/2 z-20 mt-2 grid w-[126px] -translate-x-1/2 grid-cols-5 gap-2 rounded-[10px] bg-white p-2">
                                            {PASTEL_SHIFT_COLORS.map((color) => {
                                                const isSelected = shiftType.color.toLowerCase() === color.toLowerCase();

                                                return (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        aria-label={`${color} 선택`}
                                                        className="flex h-5 w-5 items-center justify-center rounded-[6px]"
                                                        style={{backgroundColor: color}}
                                                        onClick={() => {
                                                            patchDraft(shiftType.wardShiftTypeId, {color});
                                                            setOpenedColorShiftTypeId(null);
                                                        }}
                                                    >
                                                        {isSelected ? <Check className="h-3.5 w-3.5 text-white" /> : null}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : null}
                                </div>
                                {shiftType.isDefault ? (
                                    <div className="h-10 w-10" aria-hidden="true" />
                                ) : (
                                    <button
                                        type="button"
                                        aria-label={`${shiftType.name || '근무'} 삭제`}
                                        onClick={() => removeDraftShiftType(shiftType.wardShiftTypeId)}
                                        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-4 hover:bg-gray-7 hover:text-sub-1"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
                <button
                    type="button"
                    className="group flex items-center gap-2 font-apple text-sm font-medium text-gray-3 transition-colors hover:text-sub-2.5"
                    onClick={addDraftShiftType}
                >
                    <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-gray-3 transition-colors group-hover:bg-sub-2.5">
                        <Plus className="h-[11px] w-[11px] text-white" />
                    </span>
                    근무 유형 추가하기
                </button>
                <button
                    type="button"
                    onClick={saveAllShiftTypes}
                    className={cn(
                        'h-11 rounded-[12px] px-5 font-apple text-sm font-semibold transition-colors',
                        showValidationHighlight && hasAnyValidationError
                            ? 'bg-gray-6 text-gray-3 hover:bg-gray-6'
                            : 'bg-main-1 text-white hover:bg-main-2',
                    )}
                >
                    저장하기
                </button>
            </div>
        </div>
    );
}

function ConstraintsContent({
    state,
    actions,
}: {
    state: Pick<TWardSettingsState, 'wardId' | 'shiftTeams' | 'shiftTeamsStatus' | 'currentShiftTeamId'>;
    actions: Pick<TWardSettingsActions, 'selectShiftTeam' | 'retryShiftTeams'>;
}) {
    const {t} = useTypedTranslation();
    const today = useMemo(() => new Date(), []);
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    if (state.shiftTeamsStatus === 'pending') {
        return (
            <div className="rounded-[10px] bg-white">
                <PageState tone="loading" title={t('page.wardSettings.constraints.loading')} className="py-0" />
            </div>
        );
    }

    if (state.shiftTeamsStatus === 'error') {
        return (
            <div className="rounded-[10px] bg-white">
                <PageState
                    tone="error"
                    title={t('page.wardSettings.constraints.error')}
                    description={t('page.state.errorDescription')}
                    action={{label: t('page.state.retry'), onClick: () => void actions.retryShiftTeams()}}
                    className="py-0"
                />
            </div>
        );
    }

    if (state.shiftTeams.length === 0) {
        return (
            <div className="rounded-[10px] bg-white">
                <PageState
                    tone="empty"
                    title={t('page.wardSettings.constraints.noTeamsTitle')}
                    description={t('page.wardSettings.constraints.noTeamsDescription')}
                    className="py-0"
                />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[960px]">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-apple text-sm font-semibold text-sub-2.5">{t('page.wardSettings.constraints.teamLabel')}</p>
                    <p className="mt-1 font-apple text-sm text-gray-3">{t('page.wardSettings.constraints.teamDescription')}</p>
                </div>

                <div className="max-w-full rounded-[12px] bg-gray-7 p-1">
                    <div className="scrollbar-hide flex max-w-full gap-1 overflow-x-auto whitespace-nowrap">
                        {state.shiftTeams.map((team) => {
                            const active = team.shiftTeamId === state.currentShiftTeamId;

                            return (
                                <button
                                    key={team.shiftTeamId}
                                    type="button"
                                    className={cn(
                                        'rounded-[9px] px-3 py-2 font-apple text-sm font-semibold transition-colors',
                                        active ? 'bg-white text-sub-1' : 'text-gray-3 hover:text-sub-1',
                                    )}
                                    onClick={() => actions.selectShiftTeam(team.shiftTeamId)}
                                >
                                    {team.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <ShiftConstraintRules
                wardId={state.wardId}
                shiftTeamId={state.currentShiftTeamId}
                year={year}
                month={month}
                variant="settings"
            />
        </div>
    );
}

export function WardSettingsPageView({state, actions}: TWardSettingsPageViewProps) {
    const {t} = useTypedTranslation();

    return (
        <div className="mx-auto flex min-h-screen w-full max-w-[1040px] flex-col px-4 py-8">
            <div className="mx-auto flex w-full max-w-[960px] flex-col gap-4">
                <div>
                    <h1 className="font-apple text-[30px] font-semibold text-sub-1">{t('page.wardSettings.title')}</h1>
                    <p className="mt-1 font-apple text-sm text-gray-3">
                        {state.currentTab === 'shiftTypes' ? '근무 유형을 관리해요.' : '근무 규칙을 관리해요.'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <Tabs currentTab={state.currentTab} onSelect={actions.selectTab} />
                </div>
            </div>

            <div className="mt-6">
                {state.currentTab === 'shiftTypes' ? (
                    <ShiftTypeTable
                        shiftTypes={state.shiftTypes}
                        status={state.shiftTypesStatus}
                        onCreate={actions.addShiftType}
                        onUpdate={(shiftType) => actions.updateShiftType(shiftType.wardShiftTypeId, toShiftTypeUpdateDTO(shiftType))}
                        onDelete={actions.deleteShiftType}
                        onRetry={actions.retryShiftTypes}
                    />
                ) : (
                    <ConstraintsContent
                        state={{
                            wardId: state.wardId,
                            shiftTeams: state.shiftTeams,
                            shiftTeamsStatus: state.shiftTeamsStatus,
                            currentShiftTeamId: state.currentShiftTeamId,
                        }}
                        actions={{
                            selectShiftTeam: actions.selectShiftTeam,
                            retryShiftTeams: actions.retryShiftTeams,
                        }}
                    />
                )}
            </div>
        </div>
    );
}
