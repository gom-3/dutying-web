import {cn} from '@dutying/utils/style';
import {ChevronDown, Pencil, X} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {getSkillLevelBadgeStyle, getSkillPalette, skillPalettes, type TSkillLevelConfig} from '@/features/ward-skill/model/skill-level';
import SkillBadge, {getSkillBadgeTextColor} from '@/features/ward-skill/ui/skill-badge';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';

interface IMemberSkillLevelModalProps {
    open: boolean;
    config: TSkillLevelConfig;
    onClose: () => void;
    onSave: (config: TSkillLevelConfig) => void;
    onDisable: () => void;
}

const hexToRgb = (hexColor: string) => {
    const normalized = hexColor.replace('#', '');

    if (normalized.length !== 6) return null;

    const red = Number.parseInt(normalized.slice(0, 2), 16);
    const green = Number.parseInt(normalized.slice(2, 4), 16);
    const blue = Number.parseInt(normalized.slice(4, 6), 16);

    if ([red, green, blue].some((channel) => Number.isNaN(channel))) return null;

    return {red, green, blue};
};
const rgbToHex = ({red, green, blue}: {red: number; green: number; blue: number}) =>
    `#${[red, green, blue]
        .map((channel) =>
            Math.max(0, Math.min(255, Math.round(channel)))
                .toString(16)
                .padStart(2, '0'),
        )
        .join('')}`;
const interpolateHexColor = (from: string, to: string, ratio: number) => {
    const start = hexToRgb(from);
    const end = hexToRgb(to);

    if (!start || !end) return from;

    return rgbToHex({
        red: start.red + (end.red - start.red) * ratio,
        green: start.green + (end.green - start.green) * ratio,
        blue: start.blue + (end.blue - start.blue) * ratio,
    });
};

function MemberSkillLevelModal({open, config, onClose, onSave, onDisable}: IMemberSkillLevelModalProps) {
    const {t} = useTypedTranslation();
    const [localConfig, setLocalConfig] = useState(config);
    const [editingLevel, setEditingLevel] = useState<number | null>(null);
    const [editingLabel, setEditingLabel] = useState('');
    const [isLevelCountMenuOpen, setIsLevelCountMenuOpen] = useState(false);
    const [isPaletteMenuOpen, setIsPaletteMenuOpen] = useState(false);
    const [showDisableConfirmModal, setShowDisableConfirmModal] = useState(false);
    const levelCountMenuRef = useRef<HTMLDivElement | null>(null);
    const paletteMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setLocalConfig(config);
        setEditingLevel(null);
        setEditingLabel('');
        setIsLevelCountMenuOpen(false);
        setIsPaletteMenuOpen(false);
        setShowDisableConfirmModal(false);
    }, [config]);

    useEffect(() => {
        if (!isLevelCountMenuOpen) return;

        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!levelCountMenuRef.current?.contains(event.target as Node)) {
                setIsLevelCountMenuOpen(false);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsLevelCountMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [isLevelCountMenuOpen]);

    useEffect(() => {
        if (!isPaletteMenuOpen) return;

        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!paletteMenuRef.current?.contains(event.target as Node)) {
                setIsPaletteMenuOpen(false);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsPaletteMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [isPaletteMenuOpen]);

    if (!open) return null;

    const palette = getSkillPalette(localConfig.paletteId);
    const levelItems = Array.from({length: localConfig.levelCount}, (_, index) => localConfig.levelCount - index);
    const getDefaultLevelLabel = (level: number) => `LV. ${level}`;
    const getLevelLabel = (level: number) => localConfig.levelLabels?.[level] ?? getDefaultLevelLabel(level);
    const levelCountOptions = [2, 3, 4, 5];
    const selectedLevelCountLabel = t('page.member.skillLevelModal.levelCountOption', {levelCount: localConfig.levelCount});
    const startEditing = (level: number) => {
        setEditingLevel(level);
        setEditingLabel(getLevelLabel(level));
    };
    const commitEditing = (level: number) => {
        setLocalConfig((prev) => {
            const nextLabels = {...(prev.levelLabels ?? {})};
            const nextLabel = editingLabel.trim();
            const defaultLabel = getDefaultLevelLabel(level);

            if (!nextLabel || nextLabel === defaultLabel) {
                delete nextLabels[level];
            } else {
                nextLabels[level] = nextLabel;
            }

            return {
                ...prev,
                levelLabels: Object.keys(nextLabels).length > 0 ? nextLabels : undefined,
            };
        });
        setEditingLevel(null);
        setEditingLabel('');
    };
    const getDistributedPaletteColors = (targetCount: number) => {
        if (targetCount <= 0) return [];

        if (palette.colors.length === 0) return [];

        if (palette.colors.length === 1) return Array.from({length: targetCount}, () => palette.colors[0]);

        if (targetCount === 1) return [palette.colors[0]];

        return Array.from({length: targetCount}, (_, index) => {
            const position = index / (targetCount - 1);
            const scaled = position * (palette.colors.length - 1);
            const leftIndex = Math.floor(scaled);
            const rightIndex = Math.min(palette.colors.length - 1, leftIndex + 1);
            const blendRatio = scaled - leftIndex;
            const leftColor = palette.colors[leftIndex] ?? palette.colors[palette.colors.length - 1];
            const rightColor = palette.colors[rightIndex] ?? leftColor;

            return interpolateHexColor(leftColor, rightColor, blendRatio);
        });
    };
    const getBadgeBackgroundColor = (level: number) => {
        const paletteColors = getDistributedPaletteColors(localConfig.levelCount);

        if (paletteColors.length === 0) {
            return getSkillLevelBadgeStyle(level).background;
        }

        const clampedLevel = Math.max(1, Math.min(localConfig.levelCount, level));
        const reverseIndex = clampedLevel - 1;

        return paletteColors[reverseIndex] ?? paletteColors[paletteColors.length - 1];
    };
    const getBadgeTextColor = (level: number) => getSkillBadgeTextColor(getBadgeBackgroundColor(level), {level, levelCount: localConfig.levelCount});
    const highestSkillColor = getBadgeBackgroundColor(localConfig.levelCount);
    const modalRoot = document.getElementById('modal-root') ?? document.body;

    return createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 px-4 backdrop-blur-[2px] [&_button:not(:disabled)]:cursor-pointer">
            <div role="dialog" aria-modal="true" className="w-full max-w-[710px] rounded-[20px] bg-white px-[42px] py-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="font-apple text-[32px] font-semibold text-text-1">{t('page.member.skillLevelModal.title')}</h2>
                        <p className="mt-2 font-apple text-[20px] font-medium text-gray-3">
                            {t('page.member.skillLevelModal.description')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-4 hover:bg-gray-7"
                        aria-label={t('page.member.skillLevelModal.close')}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="mt-10 flex items-center gap-4">
                    <div ref={levelCountMenuRef} className="relative">
                        <button
                            type="button"
                            aria-haspopup="listbox"
                            aria-expanded={isLevelCountMenuOpen}
                            aria-label={t('page.member.skillLevelModal.levelCountOption', {levelCount: localConfig.levelCount})}
                            className={cn(
                                'flex h-8 min-w-[112px] items-center justify-between gap-3 rounded-[5px] bg-gray-6 px-3 font-apple text-[16px] text-gray-3 transition-colors focus-visible:outline-2 focus-visible:outline-main-1',
                                isLevelCountMenuOpen ? 'bg-white shadow-[0px_10px_28px_rgba(95,100,135,0.16)]' : 'hover:bg-gray-7',
                            )}
                            onClick={() => setIsLevelCountMenuOpen((prev) => !prev)}
                        >
                            <span>{selectedLevelCountLabel}</span>
                            <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', isLevelCountMenuOpen && 'rotate-180')} />
                        </button>

                        {isLevelCountMenuOpen ? (
                            <div
                                role="listbox"
                                aria-label={t('page.member.skillLevelModal.levelLabel')}
                                className="absolute top-full left-0 z-20 mt-1 w-[120px] animate-in overflow-hidden rounded-[10px] border border-gray-6 bg-white py-1 shadow-[0px_10px_28px_rgba(95,100,135,0.16)] duration-150 fade-in-0 zoom-in-95 slide-in-from-top-1"
                            >
                                {levelCountOptions.map((levelCount) => {
                                    const label = t('page.member.skillLevelModal.levelCountOption', {levelCount});
                                    const isSelected = localConfig.levelCount === levelCount;

                                    return (
                                        <button
                                            key={levelCount}
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            className={cn(
                                                'flex w-full items-center px-4 py-2.5 text-left font-apple text-[15px] transition-colors hover:bg-gray-7 focus-visible:outline-2 focus-visible:outline-main-1',
                                                isSelected ? 'bg-main-light font-semibold text-main-1' : 'text-sub-1',
                                            )}
                                            onClick={() => {
                                                setLocalConfig((prev) => ({...prev, levelCount}));
                                                setIsLevelCountMenuOpen(false);
                                            }}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>

                    <div ref={paletteMenuRef} className="relative">
                        <button
                            type="button"
                            aria-haspopup="listbox"
                            aria-expanded={isPaletteMenuOpen}
                            aria-label={t('page.member.skillLevelModal.colorLabel')}
                            className={cn(
                                'flex h-8 min-w-[128px] items-center justify-between gap-3 rounded-[5px] bg-gray-6 px-3 transition-colors focus-visible:outline-2 focus-visible:outline-main-1',
                                isPaletteMenuOpen ? 'bg-white shadow-[0px_10px_28px_rgba(95,100,135,0.16)]' : 'hover:bg-gray-7',
                            )}
                            onClick={() => setIsPaletteMenuOpen((prev) => !prev)}
                        >
                            {palette.colors.slice(0, 4).map((color) => (
                                <span
                                    key={color}
                                    className="h-[18px] w-[18px] rounded-full border border-white"
                                    style={{backgroundColor: color}}
                                />
                            ))}
                            <ChevronDown
                                className={cn('h-4 w-4 shrink-0 text-gray-3 transition-transform', isPaletteMenuOpen && 'rotate-180')}
                            />
                        </button>

                        {isPaletteMenuOpen ? (
                            <div
                                role="listbox"
                                aria-label={t('page.member.skillLevelModal.colorLabel')}
                                className="absolute top-full left-0 z-20 mt-1 w-[132px] animate-in overflow-hidden rounded-[10px] border border-gray-6 bg-white py-1 shadow-[0px_10px_28px_rgba(95,100,135,0.16)] duration-150 fade-in-0 zoom-in-95 slide-in-from-top-1"
                            >
                                {skillPalettes.map((candidate) => {
                                    const isSelected = localConfig.paletteId === candidate.id;

                                    return (
                                        <button
                                            key={candidate.id}
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            className={cn(
                                                'flex w-full items-center justify-center gap-1.5 px-2 py-2.5 transition-colors hover:bg-gray-7 focus-visible:outline-2 focus-visible:outline-main-1',
                                                isSelected && 'bg-main-light',
                                            )}
                                            onClick={() => {
                                                setLocalConfig((prev) => ({...prev, paletteId: candidate.id}));
                                                setIsPaletteMenuOpen(false);
                                            }}
                                        >
                                            {candidate.colors.slice(0, 4).map((color) => (
                                                <span
                                                    key={color}
                                                    className="h-[18px] w-[18px] rounded-full border border-white"
                                                    style={{backgroundColor: color}}
                                                />
                                            ))}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="mt-6">
                    <div className="mb-2 grid grid-cols-[72px_1fr] font-apple text-[16px] text-gray-3">
                        <span className="text-center">{t('page.member.skillLevelModal.categoryLabel')}</span>
                        <span className="text-center">{t('page.member.skillLevelModal.levelLabel')}</span>
                    </div>
                    <div className="overflow-hidden rounded-[10px] border border-gray-5">
                        <div className="grid grid-cols-[72px_1fr]">
                            <div
                                className="flex px-4 py-6 text-center font-apple text-[20px] font-semibold text-white"
                                style={{backgroundImage: `linear-gradient(to bottom, ${highestSkillColor}, #FFFFFF)`}}
                            >
                                <div className="flex flex-1 flex-col justify-between pt-1 pb-2">
                                    <p className="text-[18px] leading-none">{t('page.member.skillLevelModal.high')}</p>
                                    <p className="text-[18px] leading-none" style={{color: highestSkillColor}}>
                                        {t('page.member.skillLevelModal.low')}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-5 px-8 py-6">
                                {levelItems.map((level) => (
                                    <div key={level} className="flex min-h-[30px] items-center justify-center">
                                        {editingLevel === level ? (
                                            <input
                                                value={editingLabel}
                                                autoFocus
                                                maxLength={12}
                                                className="inline-flex min-h-[20px] min-w-10 rounded-[4px] px-2 py-0.5 font-apple text-[12px] leading-none font-semibold tabular-nums outline-none"
                                                style={{
                                                    ...getSkillLevelBadgeStyle(level),
                                                    backgroundColor: getBadgeBackgroundColor(level),
                                                    color: getBadgeTextColor(level),
                                                }}
                                                size={Math.max(6, Math.min(12, editingLabel.length + 1))}
                                                onChange={(event) => setEditingLabel(event.target.value)}
                                                onBlur={() => commitEditing(level)}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        event.preventDefault();
                                                        commitEditing(level);
                                                    }

                                                    if (event.key === 'Escape') {
                                                        event.preventDefault();
                                                        setEditingLevel(null);
                                                        setEditingLabel('');
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                className="group flex items-center gap-1.5"
                                                onClick={() => startEditing(level)}
                                            >
                                                <SkillBadge
                                                    level={level}
                                                    config={{...localConfig, paletteId: palette.id}}
                                                    label={getLevelLabel(level)}
                                                    backgroundColor={getBadgeBackgroundColor(level)}
                                                    textColor={getBadgeTextColor(level)}
                                                    className="text-[12px]"
                                                />
                                                <Pencil className="h-2.5 w-2.5 text-[#AEB7C7] opacity-80 transition-opacity group-hover:opacity-100" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-between">
                    <button
                        type="button"
                        className="rounded-[10px] bg-[#F3F4F6] px-4 py-2 font-apple text-[16px] font-semibold text-gray-3 transition-colors hover:bg-[#EAECEF] focus-visible:outline-2 focus-visible:outline-main-1"
                        onClick={() => setShowDisableConfirmModal(true)}
                    >
                        숙련도 사용하지 않기
                    </button>
                    <button
                        type="button"
                        className="h-11 rounded-[10px] bg-main-1 px-6 font-apple text-[16px] font-semibold text-white transition-colors hover:bg-main-2 focus-visible:outline-2 focus-visible:outline-main-1"
                        onClick={() => {
                            onSave({...localConfig, enabled: true});
                            onClose();
                        }}
                    >
                        {t('page.member.skillLevelModal.complete')}
                    </button>
                </div>
            </div>
            {showDisableConfirmModal ? (
                <div
                    className="fixed inset-0 z-[100001] flex items-center justify-center bg-black/45 px-4"
                    onClick={() => setShowDisableConfirmModal(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="w-full max-w-[460px] rounded-[16px] bg-white px-6 py-5"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <p className="font-apple text-[22px] font-semibold text-sub-1">숙련도 기능을 끌까요?</p>
                        <p className="mt-2 font-apple text-[16px] text-gray-3">끄면 숙련도 표시, 선택, 정렬을 잠시 멈춰요.</p>
                        <div className="mt-6 flex items-center gap-3">
                            <button
                                type="button"
                                className="h-11 flex-1 rounded-[10px] bg-[#F3F4F6] px-6 font-apple text-[16px] font-semibold text-gray-3 transition-colors hover:bg-[#EAECEF]"
                                onClick={() => setShowDisableConfirmModal(false)}
                            >
                                닫기
                            </button>
                            <button
                                type="button"
                                className="h-11 flex-1 rounded-[10px] bg-[#D14343] px-6 font-apple text-[16px] font-semibold text-white transition-colors hover:bg-[#BD3434]"
                                onClick={() => {
                                    setShowDisableConfirmModal(false);
                                    onDisable();
                                    onClose();
                                }}
                            >
                                사용하지 않기
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>,
        modalRoot,
    );
}

export default MemberSkillLevelModal;
