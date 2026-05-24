import {cn} from '@dutying/utils/style';
import {cva, type VariantProps} from 'class-variance-authority';

const statusBadgeVariants = cva('inline-flex items-center gap-2 rounded-full border font-apple font-medium whitespace-nowrap', {
    variants: {
        tone: {
            neutral: 'border-sub-4.5 bg-white text-sub-2.5',
            brand: 'border-main-light bg-[#F2F7FF] text-main-1',
            success: 'border-[#C8E8D2] bg-[#F3FFF7] text-[#237548]',
            warning: 'border-[#FFE0A3] bg-[#FFF9EA] text-[#A56600]',
            danger: 'border-[#FFD3D3] bg-[#FFF6F6] text-[#B42318]',
        },
        size: {
            sm: 'px-2.5 py-1 text-sm',
            md: 'px-3.5 py-1.5 text-base',
        },
    },
    defaultVariants: {
        tone: 'neutral',
        size: 'sm',
    },
});

type TStatusBadgeProps = VariantProps<typeof statusBadgeVariants> & {
    label: string;
    count?: number;
    className?: string;
};

function StatusBadge({label, count, tone, size, className}: TStatusBadgeProps) {
    return (
        <span className={cn(statusBadgeVariants({tone, size}), className)}>
            <span>{label}</span>
            {typeof count === 'number' ? (
                <span className="rounded-full bg-black/6 px-2 py-0.5 text-[0.875em] leading-none">{count}</span>
            ) : null}
        </span>
    );
}

export default StatusBadge;
