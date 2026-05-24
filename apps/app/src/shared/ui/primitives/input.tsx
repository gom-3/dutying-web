import {cn} from '@dutying/utils/style';
import {cva, type VariantProps} from 'class-variance-authority';
import * as React from 'react';

const inputVariants = cva(
    'flex w-full transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring',
                foundation:
                    'rounded-[10px] border border-gray-5 bg-white px-3 text-[18px] text-sub-1 shadow-none focus-visible:border-2 focus-visible:border-main-1',
                flush: 'border-none bg-transparent px-0 shadow-none focus-visible:ring-0',
            },
            fieldSize: {
                default: 'h-9',
                md: 'h-10',
                lg: 'h-11',
            },
        },
        defaultVariants: {
            variant: 'default',
            fieldSize: 'default',
        },
    },
);

export interface IInputProps extends Omit<React.ComponentProps<'input'>, 'size'>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(({className, type, variant, fieldSize, ...props}, ref) => {
    return <input ref={ref} type={type} className={cn(inputVariants({variant, fieldSize}), className)} {...props} />;
});

Input.displayName = 'Input';

export {Input, inputVariants};
