import {cn} from '@dutying/utils/style';

type TLoadingSpinnerProps = {
    className?: string;
    size?: number;
};

const SPINNER_COLOR = '#9B7CFF';

function LoadingSpinner({className, size = 42}: TLoadingSpinnerProps) {
    return (
        <div className={cn('inline-flex items-center justify-center', className)} aria-label="loading">
            <span
                className="inline-block animate-spin rounded-full border-[3px] border-[#E9E1FF] border-t-[#9B7CFF]"
                style={{width: size, height: size, borderTopColor: SPINNER_COLOR}}
            />
        </div>
    );
}

export default LoadingSpinner;
