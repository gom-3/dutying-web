import {cn} from '@dutying/utils/style';
import * as React from 'react';
import {Button as ShadcnButton} from '@/shared/ui/primitives/button';

type TButtonVariant = 'default' | 'outline' | 'secondary' | 'link';
type TButtonSize = 'hero' | 'pill' | 'md' | 'sm';

type TButtonProps = Omit<React.ComponentProps<typeof ShadcnButton>, 'variant' | 'size'> & {
    variant?: TButtonVariant;
    size?: TButtonSize;
};

const primitiveVariantMap: Record<TButtonVariant, React.ComponentProps<typeof ShadcnButton>['variant']> = {
    default: 'brand',
    outline: 'brandOutline',
    secondary: 'soft',
    link: 'link',
};
const primitiveSizeMap: Record<TButtonSize, React.ComponentProps<typeof ShadcnButton>['size']> = {
    hero: 'hero',
    pill: 'pill',
    md: 'default',
    sm: 'sm',
};

function Button({children, className, variant = 'default', size = 'hero', ...props}: TButtonProps) {
    return (
        <ShadcnButton
            variant={primitiveVariantMap[variant]}
            size={primitiveSizeMap[size]}
            className={cn(variant === 'default' && 'disabled:bg-main-3', className)}
            {...props}
        >
            {children}
        </ShadcnButton>
    );
}

export default Button;
