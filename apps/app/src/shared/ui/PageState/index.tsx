import {cn} from '@dutying/utils/style';
import {Inbox, RotateCcw, TriangleAlert} from 'lucide-react';
import type {ButtonHTMLAttributes, ReactNode} from 'react';
import Button from '@/shared/ui/form-controls/Button';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';

type TPageStateTone = 'loading' | 'error' | 'empty';
type TPageStateLayout = 'screen' | 'panel' | 'inline';

type TPageStateAction = {
    label: string;
    onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
};

type TPageStateProps = {
    tone: TPageStateTone;
    title: string;
    description?: string;
    action?: TPageStateAction;
    layout?: TPageStateLayout;
    className?: string;
    children?: ReactNode;
};

const containerClassName: Record<TPageStateLayout, string> = {
    screen: 'flex min-h-screen w-full items-center justify-center px-6 py-10',
    panel: 'flex h-full min-h-[300px] w-full items-center justify-center px-6 py-10',
    inline: 'flex w-full items-center justify-center px-4 py-6',
};
const cardClassName: Record<TPageStateTone, string> = {
    loading: 'bg-white',
    error: 'bg-[#FFF7F8]',
    empty: 'bg-gray-7',
};
const iconWrapperClassName: Record<TPageStateTone, string> = {
    loading: 'bg-main-light text-main-1',
    error: 'bg-[#FFE7EA] text-red',
    empty: 'bg-white text-gray-4',
};

function PageStateIcon({tone}: {tone: TPageStateTone}) {
    if (tone === 'loading') {
        return <LoadingSpinner size={32} />;
    }

    if (tone === 'error') {
        return <TriangleAlert className="size-6" strokeWidth={1.9} aria-hidden="true" />;
    }

    return <Inbox className="size-6" strokeWidth={1.9} aria-hidden="true" />;
}

function PageState({tone, title, description, action, layout = 'panel', className, children}: TPageStateProps) {
    const isLoading = tone === 'loading';

    return (
        <div className={cn(containerClassName[layout], className)}>
            <div
                className={cn('w-full max-w-[28rem] rounded-[20px] px-6 py-7 text-center', cardClassName[tone])}
                role={tone === 'error' ? 'alert' : 'status'}
                aria-live={tone === 'error' ? 'assertive' : 'polite'}
            >
                <div className={cn('mx-auto flex size-12 items-center justify-center rounded-[16px]', iconWrapperClassName[tone])}>
                    <PageStateIcon tone={tone} />
                </div>

                <h2 className="mt-4 font-apple text-[20px] font-semibold tracking-[-0.02em] text-sub-1">{title}</h2>
                {description ? <p className="mt-2 font-apple text-[14px] leading-6 text-gray-3">{description}</p> : null}

                {action ? (
                    <div className="mt-6 flex justify-center">
                        <Button
                            onClick={action.onClick}
                            type="button"
                            size="md"
                            className="h-11 rounded-[14px] px-5 font-semibold"
                            disabled={isLoading}
                        >
                            <RotateCcw className="size-[18px]" strokeWidth={2.2} aria-hidden="true" />
                            {action.label}
                        </Button>
                    </div>
                ) : null}

                {children ? <div className="mt-5">{children}</div> : null}
            </div>
        </div>
    );
}

export default PageState;
