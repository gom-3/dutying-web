import {cn} from '@dutying/utils/style';
import {getSkillLevelBadgeStyle, getSkillPalette, type TSkillLevelConfig} from '../model/skill-level';

interface ISkillBadgeProps {
    level: number | null | undefined;
    config: TSkillLevelConfig;
    className?: string;
    label?: string;
    backgroundColor?: string;
    textColor?: string;
}

interface ISkillTextColorOptions {
    level?: number | null;
    levelCount?: number;
}

function darkenHexColor(backgroundColor: string, factor = 0.52): string {
    const value = backgroundColor.trim();
    const hex = value.startsWith('#') ? value.slice(1) : value;

    if (hex.length !== 6) {
        return '#1F2937';
    }

    const red = Number.parseInt(hex.slice(0, 2), 16);
    const green = Number.parseInt(hex.slice(2, 4), 16);
    const blue = Number.parseInt(hex.slice(4, 6), 16);

    if ([red, green, blue].some((channel) => Number.isNaN(channel))) {
        return '#1F2937';
    }

    const tonedRed = Math.round(red * factor);
    const tonedGreen = Math.round(green * factor);
    const tonedBlue = Math.round(blue * factor);

    return `#${[tonedRed, tonedGreen, tonedBlue]
        .map((channel) => Math.max(0, Math.min(255, channel)).toString(16).padStart(2, '0'))
        .join('')}`;
}

export function getReadableTextColor(backgroundColor: string): string {
    const value = backgroundColor.trim();
    const hex = value.startsWith('#') ? value.slice(1) : value;

    if (hex.length !== 6) {
        return '#1F2937';
    }

    const red = Number.parseInt(hex.slice(0, 2), 16);
    const green = Number.parseInt(hex.slice(2, 4), 16);
    const blue = Number.parseInt(hex.slice(4, 6), 16);

    if ([red, green, blue].some((channel) => Number.isNaN(channel))) {
        return '#1F2937';
    }

    const srgb = [red, green, blue].map((channel) => channel / 255);
    const linear = srgb.map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
    const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];

    return luminance < 0.42 ? '#FFFFFF' : '#1F2937';
}

export function getSkillBadgeTextColor(backgroundColor: string, options?: ISkillTextColorOptions): string {
    const {level, levelCount} = options ?? {};

    if (level != null && levelCount != null && level === levelCount) {
        return '#FFFFFF';
    }

    return darkenHexColor(backgroundColor);
}

export function getSkillBadgeBackgroundColor(level: number, config: TSkillLevelConfig): string {
    const safeLevel = Math.max(1, Math.min(config.levelCount, level ?? config.levelCount));
    const palette = getSkillPalette(config.paletteId);
    const colors = palette.colors;

    if (colors.length === 0) return getSkillLevelBadgeStyle(safeLevel).background;

    if (colors.length === 1) return colors[0];

    if (config.levelCount <= 1) return colors[0];

    const indexFromHigh = safeLevel - 1;
    const position = indexFromHigh / Math.max(1, config.levelCount - 1);
    const scaled = position * (colors.length - 1);
    const leftIndex = Math.floor(scaled);
    const rightIndex = Math.min(colors.length - 1, leftIndex + 1);
    const blendRatio = scaled - leftIndex;
    const leftColor = colors[leftIndex] ?? colors[colors.length - 1];
    const rightColor = colors[rightIndex] ?? leftColor;
    const parse = (hex: string) => {
        const normalized = hex.replace('#', '');

        if (normalized.length !== 6) return null;

        const red = Number.parseInt(normalized.slice(0, 2), 16);
        const green = Number.parseInt(normalized.slice(2, 4), 16);
        const blue = Number.parseInt(normalized.slice(4, 6), 16);

        if ([red, green, blue].some((channel) => Number.isNaN(channel))) return null;

        return {red, green, blue};
    };
    const start = parse(leftColor);
    const end = parse(rightColor);

    if (!start || !end) return leftColor;

    const toHex = (value: number) =>
        Math.max(0, Math.min(255, Math.round(value)))
            .toString(16)
            .padStart(2, '0');

    return `#${toHex(start.red + (end.red - start.red) * blendRatio)}${toHex(start.green + (end.green - start.green) * blendRatio)}${toHex(start.blue + (end.blue - start.blue) * blendRatio)}`;
}

function SkillBadge({level, config, className = '', label, backgroundColor, textColor}: ISkillBadgeProps) {
    const safeLevel = Math.max(1, Math.min(config.levelCount, level ?? config.levelCount));
    const resolvedBackground = backgroundColor ?? getSkillBadgeBackgroundColor(safeLevel, config);
    const resolvedTextColor = textColor ?? getSkillBadgeTextColor(resolvedBackground, {level: safeLevel, levelCount: config.levelCount});
    const resolvedLabel = label ?? config.levelLabels?.[safeLevel] ?? `LV. ${safeLevel}`;

    return (
        <div
            className={cn(
                'inline-flex min-h-5 min-w-10 items-center justify-center rounded-full px-2 py-0.5 font-apple text-[11px] leading-none font-semibold tabular-nums',
                className,
            )}
            style={{backgroundColor: resolvedBackground, color: resolvedTextColor}}
        >
            {resolvedLabel}
        </div>
    );
}

export default SkillBadge;
