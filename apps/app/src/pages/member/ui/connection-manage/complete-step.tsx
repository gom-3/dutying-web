import {TriangleAlert, X} from 'lucide-react';
import {SuccessCircleIcon} from '@/shared/assets/svg';
import {type TConnectMode, getConnectionManageResultCopy, type TConnectionManageSubmitStatus} from '../../model/connection-manage';

interface IConnectionManageCompleteStepProps {
    submitStatus: TConnectionManageSubmitStatus;
    connectMode: TConnectMode;
    waitingNurseName?: string;
    targetLabel?: string | null;
    onRestart: () => void;
    onBack: () => void;
    onRetry: () => void;
    onClose: () => void;
}

function ConnectionManageCompleteStep({
    submitStatus,
    connectMode,
    waitingNurseName,
    targetLabel,
    onRestart,
    onBack,
    onRetry,
    onClose,
}: IConnectionManageCompleteStepProps) {
    if (submitStatus === 'idle') return null;

    const feedback = getConnectionManageResultCopy({
        submitStatus,
        connectMode,
        waitingNurseName,
        targetLabel,
    });
    const isLoading = submitStatus === 'loading';
    const isError = submitStatus === 'error';

    return (
        <div
            className="relative flex min-h-[320px] w-full max-w-[620px] flex-col items-center justify-center rounded-[16px] bg-white px-5 py-6"
            onClick={(event) => event.stopPropagation()}
        >
            <button
                type="button"
                aria-label="닫기"
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-[10px] text-[#8A94A8] transition-colors hover:bg-[#F3F4F6] hover:text-[#5F6878]"
                onClick={onClose}
            >
                <X className="h-5 w-5" />
            </button>

            {isLoading ? (
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-main-2/20 border-t-main-1" aria-label="loading" />
            ) : isError ? (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE7EA] text-[#D14343]">
                    <TriangleAlert className="h-8 w-8" />
                </div>
            ) : (
                <SuccessCircleIcon className="h-14 w-14" />
            )}

            <h1 className="mt-4 font-apple text-[24px] font-semibold text-sub-1">{feedback.title}</h1>
            <p className="mt-2 max-w-[460px] text-center font-apple text-[15px] leading-6 text-gray-3">{feedback.description}</p>

            <div className="mt-7 flex w-full max-w-[420px] items-center gap-2.5">
                {isLoading ? (
                    <button className="h-11 flex-1 rounded-[10px] border border-sub-4.5 bg-sub-5 font-apple text-[15px] font-medium text-sub-2.5" disabled>
                        처리 중...
                    </button>
                ) : isError ? (
                    <>
                        <button
                            className="h-11 w-[34%] rounded-[10px] bg-[#F3F4F6] px-4 font-apple text-[16px] font-semibold text-gray-3 transition-colors hover:bg-[#EAECEF]"
                            onClick={onBack}
                        >
                            이전 단계
                        </button>
                        <button
                            className="h-11 w-[66%] rounded-[10px] bg-main-1 px-4 font-apple text-[16px] font-semibold text-white transition-colors hover:bg-main-2"
                            onClick={onRetry}
                        >
                            다시 시도
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="h-11 flex-1 rounded-l-[10px] border border-main-3 bg-main-1 font-apple text-[15px] font-semibold text-white"
                            onClick={onRestart}
                        >
                            다른 요청 보기
                        </button>
                        <button
                            className="h-11 flex-1 rounded-r-[10px] border border-main-3 bg-sub-5 font-apple text-[15px] font-semibold text-sub-2.5"
                            onClick={onClose}
                        >
                            닫기
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ConnectionManageCompleteStep;
