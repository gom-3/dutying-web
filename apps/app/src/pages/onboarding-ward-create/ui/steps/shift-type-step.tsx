import {Check, CircleAlert, Plus, X} from 'lucide-react';
import {type ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import Card from '@/shared/ui/Card';
import {Input} from '@/shared/ui/primitives/input';
import type {TOnboardingWardShiftType} from '../../model';

interface IShiftTypeStepProps {
    shiftTypes: TOnboardingWardShiftType[];
    onChange: (shiftTypeId: string, updater: Partial<TOnboardingWardShiftType>) => void;
    onAdd: () => void;
    onDelete: (shiftTypeId: string) => void;
}

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
const SHIFT_NAME_MAX_LENGTH = 12;
const SHIFT_TYPE_GRID_COLS = 'grid-cols-[minmax(130px,1.2fr)_56px_112px_minmax(230px,1.45fr)_48px_40px]';
const SHIFT_TYPE_INPUT_SURFACE_CLASS =
    'rounded-[10px] border-0 bg-gray-7 ring-1 ring-transparent transition-[background-color,box-shadow] duration-150 ease-out hover:bg-gray-6/50 focus-visible:border-0 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-main-1/70';
const SHIFT_TYPE_INPUT_ERROR_CLASS =
    'bg-[#FFF7F8] ring-1 ring-red/45 focus-visible:border-0 focus-visible:bg-white focus-visible:ring-red/70';
const SHIFT_TIME_FORMAT_REGEX = /^\d{2}:\d{2}$/;
const parseShiftTimeToMinutes = (value: string) => {
    if (!SHIFT_TIME_FORMAT_REGEX.test(value)) return null;

    const [hour, minute] = value.split(':').map(Number);

    if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

    return hour * 60 + minute;
};
const normalizeShiftTimeInput = (value: string) => {
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
};
const toCanonicalShiftTime = (value: string) => {
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
};

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

function ShiftTypeStep({shiftTypes, onChange, onAdd, onDelete}: IShiftTypeStepProps) {
    const [openedColorShiftTypeId, setOpenedColorShiftTypeId] = useState<string | null>(null);
    const [shortNameErrorById, setShortNameErrorById] = useState<Record<string, string>>({});
    const openedColorContainerRef = useRef<HTMLDivElement | null>(null);
    const duplicatedShiftNames = useMemo(() => {
        const countByName = new Map<string, number>();

        shiftTypes.forEach((shiftType) => {
            const normalizedName = shiftType.name.trim().toLocaleLowerCase();

            if (!normalizedName) return;

            countByName.set(normalizedName, (countByName.get(normalizedName) ?? 0) + 1);
        });

        return new Set(
            Array.from(countByName.entries())
                .filter(([, count]) => count > 1)
                .map(([name]) => name),
        );
    }, [shiftTypes]);
    const duplicatedShiftShortNames = useMemo(() => {
        const countByShortName = new Map<string, number>();

        shiftTypes.forEach((shiftType) => {
            const normalizedShortName = shiftType.shortName.trim().toLocaleUpperCase();

            if (!normalizedShortName) return;

            countByShortName.set(normalizedShortName, (countByShortName.get(normalizedShortName) ?? 0) + 1);
        });

        return new Set(
            Array.from(countByShortName.entries())
                .filter(([, count]) => count > 1)
                .map(([shortName]) => shortName),
        );
    }, [shiftTypes]);
    const getShiftNameError = (name: string) => {
        const normalizedName = name.trim().toLocaleLowerCase();

        if (!normalizedName) return '근무명을 입력해 주세요.';

        if (duplicatedShiftNames.has(normalizedName)) return '다른 근무명을 입력해 주세요.';

        return null;
    };
    const getShiftShortNameError = (shiftTypeId: string, shortName: string) => {
        if (shortNameErrorById[shiftTypeId]) return shortNameErrorById[shiftTypeId];

        const normalizedShortName = shortName.trim().toLocaleUpperCase();

        if (!normalizedShortName) return '약자를 입력해 주세요.';

        if (duplicatedShiftShortNames.has(normalizedShortName)) return '다른 약자를 입력해 주세요.';

        return null;
    };
    const getShiftTimeError = (shiftType: TOnboardingWardShiftType) => {
        if (shiftType.isOff) return null;

        const normalizedStartTime = shiftType.startTime.trim();
        const normalizedEndTime = shiftType.endTime.trim();

        if (!normalizedStartTime || !normalizedEndTime) return '시간을 입력해 주세요.';

        const startMinutes = parseShiftTimeToMinutes(normalizedStartTime);
        const endMinutes = parseShiftTimeToMinutes(normalizedEndTime);

        if (startMinutes == null || endMinutes == null) return '시간은 00:00 형식으로 입력해 주세요.';

        const isEndEarlierThanStart = endMinutes < startMinutes;
        const isSameTime = endMinutes === startMinutes;

        if (isSameTime || (isEndEarlierThanStart && shiftType.classification !== 'NIGHT')) return '시작/종료 시간을 확인해 주세요.';

        return null;
    };
    const getShiftDurationLabel = (shiftType: TOnboardingWardShiftType) => {
        if (shiftType.isOff) return '';

        const startMinutes = parseShiftTimeToMinutes(shiftType.startTime.trim());
        const endMinutes = parseShiftTimeToMinutes(shiftType.endTime.trim());

        if (startMinutes == null || endMinutes == null || endMinutes === startMinutes) {
            return '-';
        }

        if (endMinutes < startMinutes && shiftType.classification !== 'NIGHT') {
            return '-';
        }

        const diffMinutes = endMinutes < startMinutes ? endMinutes + 24 * 60 - startMinutes : endMinutes - startMinutes;
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        if (minutes === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${minutes}m`;
    };

    useEffect(() => {
        if (!openedColorShiftTypeId) return;

        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;

            if (openedColorContainerRef.current?.contains(target)) return;

            setOpenedColorShiftTypeId(null);
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [openedColorShiftTypeId]);

    return (
        <Card variant="elevated" padding="none" className="border-transparent bg-transparent p-0 shadow-none">
            <div
                className={`mb-2 grid ${SHIFT_TYPE_GRID_COLS} items-center gap-4 px-3 text-center font-apple text-[13px] font-medium text-gray-3`}
            >
                <span>근무명</span>
                <span>약자</span>
                <span>유형</span>
                <span>근무 시간</span>
                <span>색상</span>
                <span />
            </div>
            <div className="overflow-hidden rounded-[16px] bg-white px-1 py-1">
                {shiftTypes.map((shiftType) => (
                    <div key={shiftType.id} className={`grid ${SHIFT_TYPE_GRID_COLS} items-start gap-4 px-3 py-3`}>
                        <div className="flex flex-col gap-1">
                            <Input
                                value={shiftType.name}
                                maxLength={SHIFT_NAME_MAX_LENGTH}
                                onChange={(event) => onChange(shiftType.id, {name: event.target.value})}
                                variant="foundation"
                                fieldSize="lg"
                                aria-invalid={Boolean(getShiftNameError(shiftType.name))}
                                aria-describedby={
                                    getShiftNameError(shiftType.name) ? `onboarding-shift-name-error-${shiftType.id}` : undefined
                                }
                                className={`mx-auto w-full text-center font-apple text-[15px] ${SHIFT_TYPE_INPUT_SURFACE_CLASS} ${
                                    getShiftNameError(shiftType.name) ? SHIFT_TYPE_INPUT_ERROR_CLASS : ''
                                }`}
                                placeholder="근무명"
                            />
                            {getShiftNameError(shiftType.name) ? (
                                <InlineFieldError id={`onboarding-shift-name-error-${shiftType.id}`}>
                                    {getShiftNameError(shiftType.name)}
                                </InlineFieldError>
                            ) : null}
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Input
                                value={shiftType.shortName}
                                maxLength={1}
                                onChange={(event) => {
                                    const upper = event.target.value.toUpperCase();
                                    const alphaOnly = upper.replace(/[^A-Z]/g, '').slice(0, 1);

                                    if (upper !== alphaOnly) {
                                        setShortNameErrorById((prev) => ({
                                            ...prev,
                                            [shiftType.id]: '영문 1글자만 입력해 주세요.',
                                        }));
                                    } else {
                                        setShortNameErrorById((prev) => ({...prev, [shiftType.id]: ''}));
                                    }

                                    onChange(shiftType.id, {shortName: alphaOnly});
                                }}
                                variant="foundation"
                                fieldSize="lg"
                                aria-invalid={Boolean(getShiftShortNameError(shiftType.id, shiftType.shortName))}
                                aria-describedby={
                                    getShiftShortNameError(shiftType.id, shiftType.shortName)
                                        ? `onboarding-shift-short-name-error-${shiftType.id}`
                                        : undefined
                                }
                                className={`h-10 w-10 px-0 text-center font-poppins text-[15px] ${SHIFT_TYPE_INPUT_SURFACE_CLASS} ${
                                    getShiftShortNameError(shiftType.id, shiftType.shortName) ? SHIFT_TYPE_INPUT_ERROR_CLASS : ''
                                }`}
                                placeholder="-"
                            />
                            {getShiftShortNameError(shiftType.id, shiftType.shortName) ? (
                                <InlineFieldError id={`onboarding-shift-short-name-error-${shiftType.id}`}>
                                    {getShiftShortNameError(shiftType.id, shiftType.shortName)}
                                </InlineFieldError>
                            ) : null}
                        </div>
                        <div className="mx-auto flex h-10 w-full max-w-[112px] items-center rounded-[10px] bg-gray-7 p-1">
                            <button
                                type="button"
                                className={`h-full flex-1 rounded-[8px] font-apple text-[13px] leading-none font-semibold transition-colors ${
                                    !shiftType.isOff ? 'bg-white text-sub-1' : 'bg-transparent text-gray-3'
                                }`}
                                onClick={() =>
                                    onChange(shiftType.id, {
                                        isOff: false,
                                        classification: 'OTHER_WORK',
                                        startTime: shiftType.startTime || '09:00',
                                        endTime: shiftType.endTime || '18:00',
                                    })
                                }
                            >
                                근무
                            </button>
                            <button
                                type="button"
                                className={`h-full flex-1 rounded-[8px] font-apple text-[13px] leading-none font-semibold transition-colors ${
                                    shiftType.isOff ? 'bg-white text-sub-1' : 'bg-transparent text-gray-3'
                                }`}
                                onClick={() =>
                                    onChange(shiftType.id, {
                                        isOff: true,
                                        classification: 'OTHER_LEAVE',
                                        startTime: '',
                                        endTime: '',
                                    })
                                }
                            >
                                휴무
                            </button>
                        </div>
                        <div className="ml-[12px] flex justify-center self-center">
                            <div className="flex items-start">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={shiftType.isOff ? '-' : shiftType.startTime}
                                            disabled={shiftType.isOff}
                                            onChange={(event) =>
                                                onChange(shiftType.id, {startTime: normalizeShiftTimeInput(event.target.value)})
                                            }
                                            onBlur={(event) =>
                                                onChange(shiftType.id, {startTime: toCanonicalShiftTime(event.target.value)})
                                            }
                                            variant="foundation"
                                            fieldSize="lg"
                                            aria-invalid={Boolean(getShiftTimeError(shiftType))}
                                            aria-describedby={
                                                getShiftTimeError(shiftType) ? `onboarding-shift-time-error-${shiftType.id}` : undefined
                                            }
                                            className={`h-10 text-center font-poppins text-[15px] ${SHIFT_TYPE_INPUT_SURFACE_CLASS} ${
                                                getShiftTimeError(shiftType) ? SHIFT_TYPE_INPUT_ERROR_CLASS : ''
                                            }`}
                                            placeholder="07:00"
                                        />
                                        <span className="font-poppins text-[15px] text-gray-3">~</span>
                                        <Input
                                            value={shiftType.isOff ? '-' : shiftType.endTime}
                                            disabled={shiftType.isOff}
                                            onChange={(event) =>
                                                onChange(shiftType.id, {endTime: normalizeShiftTimeInput(event.target.value)})
                                            }
                                            onBlur={(event) => onChange(shiftType.id, {endTime: toCanonicalShiftTime(event.target.value)})}
                                            variant="foundation"
                                            fieldSize="lg"
                                            aria-invalid={Boolean(getShiftTimeError(shiftType))}
                                            aria-describedby={
                                                getShiftTimeError(shiftType) ? `onboarding-shift-time-error-${shiftType.id}` : undefined
                                            }
                                            className={`h-10 text-center font-poppins text-[15px] ${SHIFT_TYPE_INPUT_SURFACE_CLASS} ${
                                                getShiftTimeError(shiftType) ? SHIFT_TYPE_INPUT_ERROR_CLASS : ''
                                            }`}
                                            placeholder="15:00"
                                        />
                                    </div>
                                    {getShiftTimeError(shiftType) ? (
                                        <InlineFieldError id={`onboarding-shift-time-error-${shiftType.id}`}>
                                            {getShiftTimeError(shiftType)}
                                        </InlineFieldError>
                                    ) : null}
                                </div>
                                <span className="ml-2 flex h-10 min-w-[52px] items-center font-poppins text-[11px] leading-none whitespace-nowrap text-gray-4">
                                    {getShiftDurationLabel(shiftType)}
                                </span>
                            </div>
                        </div>
                        <div
                            className="relative flex justify-center self-center"
                            ref={openedColorShiftTypeId === shiftType.id ? openedColorContainerRef : null}
                        >
                            <button
                                type="button"
                                aria-label={`${shiftType.name || '근무'} 색상 선택`}
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] bg-gray-7"
                                onClick={() => setOpenedColorShiftTypeId((prev) => (prev === shiftType.id ? null : shiftType.id))}
                            >
                                <span className="h-6 w-6 rounded-[7px]" style={{backgroundColor: shiftType.color}} />
                            </button>
                            {openedColorShiftTypeId === shiftType.id ? (
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
                                                    onChange(shiftType.id, {color});
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
                                onClick={() => onDelete(shiftType.id)}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-4 hover:bg-gray-7 hover:text-sub-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    className="group flex items-center gap-2 font-apple text-sm font-medium text-gray-3 transition-colors hover:text-sub-2.5"
                    onClick={onAdd}
                >
                    <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-gray-3 transition-colors group-hover:bg-sub-2.5">
                        <Plus className="h-[11px] w-[11px] text-white" />
                    </span>
                    근무 유형 추가하기
                </button>
            </div>
        </Card>
    );
}

export default ShiftTypeStep;
