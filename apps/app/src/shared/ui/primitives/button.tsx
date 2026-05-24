import {cn} from '@dutying/utils/style';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
    'inline-flex box-border items-center justify-center gap-2 whitespace-nowrap rounded-md py-0 text-sm font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
                outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
                brand: 'border-[.125rem] border-main-1 bg-main-1 text-white hover:bg-main-2',
                brandOutline: 'border-[.125rem] border-main-1 bg-transparent text-main-1 hover:bg-main-4',
                soft: 'border border-transparent bg-gray-6 text-gray-3 hover:bg-gray-5',
                subtle: 'border border-transparent bg-main-light text-main-1 hover:bg-main-light/80',
            },
            size: {
                default: 'h-9 px-4',
                sm: 'h-8 rounded-md px-3 text-xs',
                lg: 'h-10 rounded-md px-8',
                icon: 'h-9 w-9',
                pill: 'h-[42px] rounded-[10px] px-5 font-apple text-[20px] font-semibold',
                hero: 'rounded-[50px] px-8 py-[1.625rem] font-apple text-[2.25rem] font-semibold',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';

    return <Comp className={cn(buttonVariants({variant, size, className}))} ref={ref} {...props} />;
});

Button.displayName = 'Button';

export {Button, buttonVariants};
