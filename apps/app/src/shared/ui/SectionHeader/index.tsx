import {cn} from '@dutying/utils/style';
import type {HTMLAttributes, ReactNode} from 'react';

interface ISectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    title: ReactNode;
    description?: ReactNode;
    titleClassName?: string;
    descriptionClassName?: string;
}

function SectionHeader({title, description, className, titleClassName, descriptionClassName, ...props}: ISectionHeaderProps) {
    return (
        <div className={cn('space-y-6', className)} {...props}>
            <h1 className={cn('font-apple text-[32px] leading-[1.18] font-semibold whitespace-pre-line text-text-1', titleClassName)}>
                {title}
            </h1>
            {description ? (
                <p className={cn('font-apple text-[20px] font-medium text-gray-3 whitespace-nowrap', descriptionClassName)}>{description}</p>
            ) : null}
        </div>
    );
}

export default SectionHeader;
