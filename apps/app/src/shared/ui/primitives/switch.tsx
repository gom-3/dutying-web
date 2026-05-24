import {cn} from '@dutying/utils/style';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';

const Switch = React.forwardRef<
    React.ComponentRef<typeof SwitchPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
        thumbClassName?: string;
    }
>(({className, thumbClassName, ...props}, ref) => {
    return (
        <SwitchPrimitive.Root
            ref={ref}
            className={cn(
                'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-start overflow-hidden rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                className={cn(
                    'pointer-events-none block h-5 w-5 shrink-0 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
                    thumbClassName,
                )}
            />
        </SwitchPrimitive.Root>
    );
});

Switch.displayName = 'Switch';

export {Switch};
