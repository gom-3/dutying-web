import {cn} from '@dutying/utils/style';
import {cva, type VariantProps} from 'class-variance-authority';
import type {HTMLAttributes, ReactNode} from 'react';

const cardVariants = cva('rounded-[20px] border', {
    variants: {
        variant: {
            default: 'border-gray-6 bg-white',
            elevated: 'border-gray-6 bg-white shadow-[0_4px_34px_0_rgba(237,233,245,1)]',
            muted: 'border-gray-5 border-dashed bg-gray-7',
            success: 'border-main-3 bg-main-light text-main-1',
        },
        padding: {
            none: '',
            md: 'p-6',
            lg: 'p-8',
        },
    },
    defaultVariants: {
        variant: 'default',
        padding: 'md',
    },
});

interface ICardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
    children: ReactNode;
}

function Card({children, className, variant, padding, ...props}: ICardProps) {
    return (
        <div className={cn(cardVariants({variant, padding}), className)} {...props}>
            {children}
        </div>
    );
}

export default Card;
