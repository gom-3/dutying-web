import {useState} from 'react';
import {InfoIcon} from '@/shared/assets/svg';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/shared/ui/primitives/tooltip';

type TConstraintSectionInfoProps = {
    label: string;
    ariaLabel: string;
};

export function ConstraintSectionInfo({label, ariaLabel}: TConstraintSectionInfoProps) {
    const [pinned, setPinned] = useState(false);
    const [hovered, setHovered] = useState(false);
    const open = pinned || hovered;

    return (
        <Tooltip
            open={open}
            onOpenChange={(next) => {
                if (pinned && !next) return;

                if (!pinned) setHovered(next);
            }}
        >
            <TooltipTrigger asChild>
                <button
                    type="button"
                    className="make-shift-constraints__section-info-trigger bg-transparent text-sub-3 transition-colors outline-none hover:bg-transparent hover:text-gray-4 focus-visible:ring-2 focus-visible:ring-main-4 focus-visible:ring-offset-2"
                    aria-label={ariaLabel}
                    aria-expanded={open}
                    onClick={() => setPinned((prev) => !prev)}
                    onPointerEnter={() => setHovered(true)}
                    onPointerLeave={() => setHovered(false)}
                >
                    <InfoIcon className="size-[clamp(13px,1.12vw,19px)] shrink-0" />
                </button>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                align="start"
                sideOffset={6}
                className="max-w-none bg-white px-[clamp(10px,0.9vw,14px)] py-[clamp(6px,0.55vw,10px)] font-apple text-[clamp(11px,0.95vw,14px)] leading-none font-medium whitespace-nowrap text-sub-1"
                onPointerDown={(e) => e.preventDefault()}
            >
                {label}
            </TooltipContent>
        </Tooltip>
    );
}
