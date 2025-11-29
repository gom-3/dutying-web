import React from 'react';
import {twMerge} from 'tailwind-merge';

interface Props extends Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'type'> {
    type?: 'outline' | 'fill' | 'button' | 'reset' | 'submit';
}

function Button({type = 'fill', children, className, ...props}: Props) {
    return (
        <button
            className={twMerge(
                `rounded-[50px] border-[.125rem] font-apple text-[2.25rem] font-semibold disabled:bg-main-3 ${
                    type === 'outline' ? 'border-main-1 text-main-1 transition-all' : 'bg-main-1 text-white'
                } ${className}`,
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
