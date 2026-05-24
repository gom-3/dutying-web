import {X} from 'lucide-react';
import {ProfileImage} from '@/entities/account/ui/profile-image';
import {type TWaitingNurse} from '@/entities/nurse';
import {getWaitingNurseSummary} from '../../model/connection-manage';

interface IConnectionManageWaitingStepProps {
    waitingNurses: TWaitingNurse[] | undefined;
    onClose: () => void;
    onAccept: (waitingNurse: TWaitingNurse) => void;
    onReject: (waitingNurseId: number) => void;
}

function ConnectionManageWaitingStep({waitingNurses, onClose, onAccept, onReject}: IConnectionManageWaitingStepProps) {
    return (
        <div className="relative w-full max-w-[620px] rounded-[16px] bg-white px-6 py-5" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
                <h1 className="font-apple text-[22px] font-semibold text-sub-1">간호사가 병동 연동을 요청했어요</h1>
                <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[#8A94A8] transition-colors hover:bg-[#F3F4F6] hover:text-[#5F6878]"
                    onClick={onClose}
                    aria-label="닫기"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <p className="mt-1 font-apple text-[14px] text-gray-3">수락하면 병동 소속 간호사로 등록돼요.</p>

            {waitingNurses?.length === 0 ? (
                <div className="mt-4 flex h-[140px] items-center justify-center rounded-[10px] bg-[#F8FAFC] font-apple text-[15px] text-gray-3">
                    연동 요청이 들어오면 여기에 보여요.
                </div>
            ) : (
                <div className="mt-4 max-h-[440px] space-y-2 overflow-y-auto">
                    {waitingNurses?.map((waitingNurse) => {
                        const waitingNurseSummary = getWaitingNurseSummary(waitingNurse);

                        return (
                            <div
                                key={waitingNurse.waitingNurseId}
                                className="flex items-center gap-3 rounded-[10px] border border-[#E3E8F1] bg-[#F9FBFE] px-4 py-3"
                            >
                                <ProfileImage
                                    className="h-9 w-9"
                                    name={waitingNurse.name}
                                    profileImg={{profileImgUrl: waitingNurse.profileImgUrl}}
                                />
                                <div className="min-w-0">
                                    <p className="truncate font-apple text-[15px] font-semibold text-sub-1">{waitingNurse.name}</p>
                                    <p className="font-poppins text-[13px] text-[#7E8798]">{waitingNurseSummary.formattedPhoneNumber}</p>
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="h-9 rounded-[8px] bg-main-1 px-3 font-apple text-[14px] font-semibold text-white transition-colors hover:bg-main-2"
                                        onClick={() => onAccept(waitingNurse)}
                                    >
                                        수락
                                    </button>
                                    <button
                                        type="button"
                                        className="h-9 rounded-[8px] px-3 font-apple text-[14px] font-semibold text-[#5E6678] transition-colors hover:bg-[#E1E7F0]"
                                        onClick={() => onReject(waitingNurse.waitingNurseId)}
                                    >
                                        거절
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ConnectionManageWaitingStep;
