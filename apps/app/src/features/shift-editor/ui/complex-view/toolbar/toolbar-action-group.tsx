import {events, sendEvent} from '@/analytics';
import {type TShiftTeam} from '@/entities';
import {
    CameraIcon,
    DutyIconSelected,
    HistoryBackIcon,
    HistoryNextIcon,
    PenIcon,
    SaveCompleteIcon,
    SavingIcon,
    ShareIcon,
} from '@/shared/assets/svg';
import Button from '@/shared/ui/form-controls/Button';
import Select from '@/shared/ui/form-controls/Select';
import {showValidationFeedback} from '@/shared/util/feedback';

type TToolbarActionGroupProps = {
    year: number;
    month: number;
    readonly: boolean;
    saveStatus: 'pending' | 'saved';
    currentShiftTeam: TShiftTeam | null;
    shiftTeams: TShiftTeam[] | null;
    onUndo: () => void;
    onRedo: () => void;
    onPostShift: () => void;
    onToggleEditMode: () => void;
    onDownloadExcel: () => void;
    onDownloadImage: () => void;
    onCreateNextMonth: () => void;
    onChangeShiftTeam: (shiftTeamId: number) => void;
    isDownloadingExcel: boolean;
    isDownloadingImage: boolean;
};

export function ToolbarActionGroup({
    year,
    month,
    readonly,
    saveStatus,
    currentShiftTeam,
    shiftTeams,
    onUndo,
    onRedo,
    onPostShift,
    onToggleEditMode,
    onDownloadExcel,
    onDownloadImage,
    onCreateNextMonth,
    onChangeShiftTeam,
    isDownloadingExcel,
    isDownloadingImage,
}: TToolbarActionGroupProps) {
    return (
        <>
            {!readonly && (
                <div className="ml-auto flex gap-[.3125rem] font-apple text-[.875rem] text-sub-2.5">
                    {saveStatus === 'pending' ? <SavingIcon className="h-5 w-5" /> : <SaveCompleteIcon className="h-5 w-5" />}
                    {saveStatus === 'pending' ? '저장중' : '저장 완료'}
                    <div className="ml-7.5 flex gap-[.625rem]">
                        <HistoryBackIcon
                            className="h-6.5 w-6.5 cursor-pointer"
                            onClick={() => {
                                onUndo();
                                sendEvent(events.makePage.toolbar.undoBytoolbar);
                            }}
                        />
                        <HistoryNextIcon
                            className="h-6.5 w-6.5 cursor-pointer"
                            onClick={() => {
                                onRedo();
                                sendEvent(events.makePage.toolbar.redoByToolbar);
                            }}
                        />
                    </div>
                </div>
            )}

            <div>
                {currentShiftTeam && (
                    <Select
                        value={currentShiftTeam.shiftTeamId}
                        options={shiftTeams?.map((shiftTeam) => ({
                            label: shiftTeam.name,
                            value: shiftTeam.shiftTeamId,
                        }))}
                        className="ml-7.5 h-11.5 w-42 font-apple text-[1.25rem] font-semibold text-main-1"
                        selectClassName="outline-[.0938rem] outline-main-1"
                        onChange={(e) => onChangeShiftTeam(parseInt(e.target.value))}
                    />
                )}
            </div>

            {readonly ? (
                <div className="ml-auto flex gap-[10px]">
                    <Button
                        variant="default"
                        className="flex h-10 items-center justify-center rounded-[.625rem] bg-main-2 px-[.75rem] text-[1.25rem] font-semibold"
                        onClick={() => {
                            onPostShift();
                            sendEvent(events.makePage.toolbar.postShift);
                        }}
                        disabled={new Date(year, month + 1, 1) <= new Date()}
                    >
                        게시하기
                    </Button>
                    <Button
                        id="editButton"
                        variant="default"
                        className="flex h-10 items-center justify-center gap-[.5rem] rounded-[.625rem] bg-main-2 pr-[.5rem] pl-[.75rem] text-[1.25rem] font-semibold"
                        onClick={() => {
                            onToggleEditMode();
                            sendEvent(events.makePage.toolbar.changeEditMode);
                        }}
                        disabled={new Date(year, month + 1, 1) <= new Date()}
                    >
                        수정하기
                        <PenIcon className="h-6 w-6 stroke-white" />
                    </Button>
                    <Button
                        id="El2"
                        variant="default"
                        className="flex h-10 items-center justify-center gap-[.5rem] rounded-[.625rem] bg-main-2 pr-[.5rem] pl-[.75rem] text-[1.25rem] font-semibold"
                        disabled={isDownloadingImage}
                        onClick={() => {
                            onDownloadImage();
                            sendEvent(events.makePage.toolbar.downloadImage);
                        }}
                    >
                        {isDownloadingImage ? '이미지 저장 중' : '이미지 저장'}
                        <CameraIcon className="h-6 w-6 stroke-white" />
                    </Button>
                    <Button
                        id="El3"
                        variant="default"
                        className="flex h-10 items-center justify-center gap-[.5rem] rounded-[.625rem] bg-main-2 pr-[.5rem] pl-[.75rem] text-[1.25rem] font-semibold"
                        disabled={isDownloadingExcel}
                        onClick={() => {
                            onDownloadExcel();
                            sendEvent(events.makePage.toolbar.downloadExcel);
                        }}
                    >
                        {isDownloadingExcel ? '엑셀 저장 중' : '엑셀 저장'}
                        <ShareIcon className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="outline"
                        className="flex h-10 w-59 items-center justify-center gap-[.5rem] rounded-[.625rem] text-[1.25rem] font-semibold"
                        onClick={() => {
                            onCreateNextMonth();
                            sendEvent(events.makePage.toolbar.editNextMonth);
                        }}
                    >
                        다음달 근무표 만들기
                        <DutyIconSelected className="h-6 w-6" />
                    </Button>
                </div>
            ) : (
                <div className="ml-5 flex gap-[.875rem]">
                    <Button
                        variant="default"
                        className="h-10 w-33 rounded-[3.125rem] border-none bg-[rgba(171,171,180,0.80)] text-[1.25rem] font-semibold text-white"
                        onClick={() => showValidationFeedback('아직 준비 중인 기능입니다.')}
                    >
                        자동 채우기
                    </Button>
                    <Button
                        className="h-10 rounded-[3.125rem] border-main-1 bg-white px-5 text-[1.25rem] font-semibold text-main-1 transition-all hover:bg-main-1 hover:text-white"
                        onClick={onToggleEditMode}
                    >
                        저장
                    </Button>
                </div>
            )}
        </>
    );
}
