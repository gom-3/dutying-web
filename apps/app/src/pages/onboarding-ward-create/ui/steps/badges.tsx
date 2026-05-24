import {cn} from '@dutying/utils/style';
import {Check} from 'lucide-react';
import SkillBadgeUi, {getSkillBadgeTextColor} from '@/features/ward-skill/ui/skill-badge';
import {getSkillPalette, type TOnboardingWardShiftType, type TSkillLevelConfig} from '../../model';

const SHIFT_BADGE_TEXT_STYLE = 'font-poppins text-[13px] font-medium leading-none text-white';
const rgbToHex = ({red, green, blue}: {red: number; green: number; blue: number}) =>
    `#${[red, green, blue]
        .map((channel) =>
            Math.max(0, Math.min(255, Math.round(channel)))
                .toString(16)
                .padStart(2, '0'),
        )
        .join('')}`;
const hexToRgb = (hexColor: string) => {
    const normalized = hexColor.replace('#', '');

    if (normalized.length !== 6) return null;

    const red = Number.parseInt(normalized.slice(0, 2), 16);
    const green = Number.parseInt(normalized.slice(2, 4), 16);
    const blue = Number.parseInt(normalized.slice(4, 6), 16);

    if ([red, green, blue].some((channel) => Number.isNaN(channel))) return null;

    return {red, green, blue};
};
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
const tintHexColor = (hexColor: string, whiteRatio: number) => interpolateHexColor(hexColor, '#ffffff', whiteRatio);
const getDistributedPaletteColors = (targetCount: number, colors: string[]) => {
    if (targetCount <= 0) return [];

    if (colors.length === 0) return [];

    if (colors.length === 1) return Array.from({length: targetCount}, () => colors[0]);

    if (targetCount === 1) return [colors[0]];

    return Array.from({length: targetCount}, (_, index) => {
        const position = index / (targetCount - 1);
        const scaled = position * (colors.length - 1);
        const leftIndex = Math.floor(scaled);
        const rightIndex = Math.min(colors.length - 1, leftIndex + 1);
        const blendRatio = scaled - leftIndex;
        const leftColor = colors[leftIndex] ?? colors[colors.length - 1];
        const rightColor = colors[rightIndex] ?? leftColor;

        return interpolateHexColor(leftColor, rightColor, blendRatio);
    });
};

export function ShiftBadge({shiftType, selected}: {shiftType: TOnboardingWardShiftType; selected?: boolean}) {
    const isSelected = Boolean(selected);
    const badgeBackgroundColor = isSelected ? shiftType.color : tintHexColor(shiftType.color, 0.45);

    return (
        <div
            className={cn(
                'flex h-[20px] min-w-[20px] items-center justify-center rounded-[5px] transition-[max-width,padding,gap] duration-150',
                isSelected
                    ? 'max-w-[56px] gap-0.5 px-1'
                    : 'max-w-[20px] gap-0 overflow-hidden px-[2px] group-hover:max-w-[56px] group-hover:gap-0.5 group-hover:px-1',
            )}
            style={{backgroundColor: badgeBackgroundColor}}
        >
            <span
                className={cn(
                    'flex h-[9px] items-center justify-center overflow-hidden transition-[width,opacity] duration-150',
                    isSelected ? 'w-[9px] opacity-100' : 'w-0 opacity-0 group-hover:w-[9px] group-hover:opacity-75',
                )}
            >
                <Check
                    className={cn(
                        'h-[9px] w-[9px] shrink-0 text-white transition-all duration-150',
                        isSelected ? 'scale-100 opacity-100' : 'scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-75',
                    )}
                    strokeWidth={3}
                />
            </span>
            <span className={cn(SHIFT_BADGE_TEXT_STYLE, 'whitespace-nowrap opacity-100 transition-transform duration-150')}>
                {shiftType.shortName || '-'}
            </span>
        </div>
    );
}

export function SkillBadge({
    level,
    config,
    className,
    label,
    backgroundColor,
    textColor,
}: {
    level: number | null;
    config: TSkillLevelConfig;
    className?: string;
    label?: string;
    backgroundColor?: string;
    textColor?: string;
}) {
    const derivedBackgroundColor = (() => {
        if (backgroundColor || level == null) return backgroundColor;

        const palette = getSkillPalette(config.paletteId);
        const paletteColors = getDistributedPaletteColors(config.levelCount, palette.colors);

        if (paletteColors.length === 0) return undefined;

        const clampedLevel = Math.max(1, Math.min(config.levelCount, level));

        return paletteColors[clampedLevel - 1] ?? paletteColors[paletteColors.length - 1];
    })();
    const derivedTextColor = textColor ?? (derivedBackgroundColor ? getSkillBadgeTextColor(derivedBackgroundColor, {level, levelCount: config.levelCount}) : undefined);

    return (
        <SkillBadgeUi
            level={level}
            config={config}
            className={cn('min-h-[19.87px] min-w-[39.74px] px-[8px] py-0 text-[10px] leading-none', className)}
            label={label}
            backgroundColor={derivedBackgroundColor}
            textColor={derivedTextColor}
        />
    );
}
