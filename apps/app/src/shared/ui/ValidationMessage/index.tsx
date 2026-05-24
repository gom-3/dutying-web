import {cn} from '@dutying/utils/style';

type TValidationMessageProps = {
    message?: string | null;
    className?: string;
};

function ValidationMessage({message, className}: TValidationMessageProps) {
    if (!message) return null;

    return (
        <p role="alert" className={cn('font-apple text-[1rem] font-medium text-red', className)}>
            {message}
        </p>
    );
}

export default ValidationMessage;
