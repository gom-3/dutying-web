import {cn} from '@dutying/utils/style';
import {produce} from 'immer';
import {Check, ChevronRight, Settings2} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {events, sendEvent} from '@/analytics';
import {type TNurse, type TWardShiftType} from '@/entities';
import useEditShiftTeam from '@/features/edit-shift-team';
import {type TSkillLevelConfig} from '@/features/ward-skill/model/skill-level';
import {getSkillBadgeBackgroundColor, getSkillBadgeTextColor} from '@/features/ward-skill/ui/skill-badge';
import {InfoIcon, LinkedIcon, UnlinkedIcon} from '@/shared/assets/svg';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import TextField from '@/shared/ui/form-controls/TextField';
import {Switch} from '@/shared/ui/primitives/switch';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/shared/ui/primitives/tooltip';
import {hasNurseChanges} from '../model/nurse-edit';

interface INurseDetailPanelProps {
    onClose: () => void;
    onOpenSkillSettings: () => void;
    isSkillFeatureEnabled: boolean;
    isSkillUnselected: boolean;
    onSaveSkillLevel: (nextLevel: number | null) => void;
    skillConfig: TSkillLevelConfig;
    skillLevel: number | null | undefined;
    wardShiftTypes: TWardShiftType[] | undefined;
    wardCode?: string | null;
}

function NurseDetailPanel({
    onClose,
    onOpenSkillSettings,
    isSkillFeatureEnabled,
    isSkillUnselected,
    onSaveSkillLevel,
    skillConfig,
    skillLevel,
    wardShiftTypes,
    wardCode,
}: INurseDetailPanelProps) {
    const {
        state: {selectedNurse, nurseSaveStatus, isDeletingNurse},
        actions: {updateNurse, deleteNurse, setNurseDraftDirty, disconnectNurse},
    } = useEditShiftTeam();
    const {t} = useTypedTranslation();
    const [writeNurse, setWriteNurse] = useState<TNurse | null>(null);
    const [showNameRequiredError, setShowNameRequiredError] = useState(false);
    const [connectionGuideModalOpen, setConnectionGuideModalOpen] = useState(false);
    const [disconnectConfirmModalOpen, setDisconnectConfirmModalOpen] = useState(false);
    const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
    const textInputRef = useRef<HTMLInputElement>(null);
    const modalRoot = document.getElementById('modal-root') ?? document.body;
    const isDirty = hasNurseChanges(selectedNurse, writeNurse);
    const isBusy = nurseSaveStatus === 'saving' || isDeletingNurse;
    const autoSaveDraft = async (draft: TNurse | null) => {
        if (!selectedNurse || !draft || isBusy) return;
        if (draft.name.trim().length === 0) return;
        if (!hasNurseChanges(selectedNurse, draft)) return;

        await updateNurse(draft.nurseId, draft);
    };
    const updateNurseField = async (updater: (prev: TNurse) => TNurse) => {
        if (!writeNurse || isBusy) return;

        const next = updater(writeNurse);
        setWriteNurse(next);
        await updateNurse(next.nurseId, next);
    };

    useEffect(() => {
        setWriteNurse(selectedNurse ?? null);
        setShowNameRequiredError(false);
        if (selectedNurse) textInputRef.current?.focus();
    }, [selectedNurse]);

    useEffect(() => {
        setNurseDraftDirty(isDirty);
    }, [isDirty, setNurseDraftDirty]);

    const shiftTypeColorByName = useMemo(
        () => new Map((wardShiftTypes ?? []).map((shiftType) => [shiftType.name, shiftType.color])),
        [wardShiftTypes],
    );

    if (!selectedNurse || !writeNurse) {
        return (
            <aside className="min-h-[748px] w-[420px] rounded-[15px] bg-white p-8 shadow-[0px_7px_29px_rgba(138,132,160,0.2)]" />
        );
    }

    return (
        <TooltipProvider delayDuration={120}>
            <aside className="relative w-[420px] overflow-hidden rounded-[15px] bg-white shadow-[0px_7px_29px_rgba(138,132,160,0.25)] [&_button:not(:disabled)]:cursor-pointer">
                <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-5 transition-colors hover:text-gray-4 focus-visible:outline-2 focus-visible:outline-main-1"
                    onClick={onClose}
                    aria-label={t('page.member.detail.close')}
                >
                    <ChevronRight aria-hidden="true" className="h-6 w-6" strokeWidth={2.4} />
                </button>

                <div className="px-[30px] pt-14 pb-6">
                    <p className="font-apple text-[16px] font-medium text-sub-2">{t('page.member.table.name')}</p>
                    <div className="mt-3 grid grid-cols-[minmax(0,90fr)_minmax(0,10fr)] items-center gap-2">
                        <TextField
                            ref={textInputRef}
                            autoFocus
                            disabled={isBusy}
                            name="nurseName"
                            maxLength={30}
                            placeholder={showNameRequiredError ? '이름' : undefined}
                            className={cn(
                                'h-12 min-w-0 rounded-[10px] px-3 text-[22px] font-bold text-text-1 outline-none focus:!border-2 focus-visible:!border-2',
                                showNameRequiredError &&
                                    '!border-2 !border-[#E57373] font-normal placeholder:font-normal placeholder:text-[#D6DCE6] focus:!outline-2 focus:!outline-[#E57373] focus-visible:!border-[#E57373]',
                            )}
                            value={writeNurse.name}
                            onChange={(event) => {
                                if (showNameRequiredError && event.target.value.trim().length > 0) {
                                    setShowNameRequiredError(false);
                                }
                                setWriteNurse((prev) => (prev ? {...prev, name: event.target.value} : prev));
                                sendEvent(events.memberPage.editNurseDrawer.changeNurseName);
                            }}
                            onBlur={() => void autoSaveDraft(writeNurse)}
                        />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    disabled={isBusy}
                                    className="inline-flex h-12 w-full items-center justify-center text-sub-2 transition-colors hover:text-sub-1 disabled:opacity-50"
                                    onClick={() => {
                                        if (writeNurse.isConnected) {
                                            setDisconnectConfirmModalOpen(true);
                                            return;
                                        }
                                        setConnectionGuideModalOpen(true);
                                    }}
                                    aria-label={`${writeNurse.name} 연동 상태`}
                                >
                                    {writeNurse.isConnected ? <LinkedIcon className="h-5 w-5" /> : <UnlinkedIcon className="h-5 w-5" />}
                                </button>
                            </TooltipTrigger>
                            {!writeNurse.isConnected ? <TooltipContent side="top">연동이 안 되고 있어요.</TooltipContent> : null}
                        </Tooltip>
                    </div>

                    {isSkillFeatureEnabled ? (
                        <div className="mt-7">
                            <div className="flex items-center justify-between">
                                <p className="font-apple text-[16px] font-medium text-sub-2">숙련도</p>
                                <button
                                    type="button"
                                    className="grid size-6 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-2 focus-visible:outline-2 focus-visible:outline-main-1"
                                    aria-label="숙련도 설정"
                                    onClick={onOpenSkillSettings}
                                >
                                    <Settings2 className="size-4" />
                                </button>
                            </div>
                            <div className="mt-5 grid w-full gap-2" style={{gridTemplateColumns: `repeat(${skillConfig.levelCount}, minmax(0, 1fr))`}}>
                                {Array.from({length: skillConfig.levelCount}, (_, index) => index + 1).map((level) => {
                                    const backgroundColor = getSkillBadgeBackgroundColor(level, skillConfig);
                                    const textColor = getSkillBadgeTextColor(backgroundColor, {level, levelCount: skillConfig.levelCount});
                                    const isSelected = !isSkillUnselected && skillLevel === level;

                                    return (
                                        <button
                                            key={level}
                                            type="button"
                                            disabled={isBusy}
                                            className={cn(
                                                'inline-flex min-h-7 w-full min-w-0 cursor-pointer items-center justify-center rounded-full border py-1 font-apple text-[13px] leading-none font-semibold tabular-nums transition duration-150 hover:-translate-y-[1px] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50',
                                                isSelected ? 'px-3' : 'px-1.5',
                                            )}
                                            style={{
                                                borderColor: isSelected ? backgroundColor : 'transparent',
                                                color: isSelected ? textColor : '#9CA3AF',
                                                backgroundColor: isSelected ? backgroundColor : '#ECEFF3',
                                            }}
                                            onClick={() => onSaveSkillLevel(isSelected ? null : level)}
                                        >
                                            <span className="block min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                                {skillConfig.levelLabels?.[level] ?? `LV. ${level}`}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="px-[30px] py-6">
                    <div className="flex items-center justify-between">
                        <p className="font-apple text-[16px] font-medium text-sub-2">{t('page.member.detail.shiftTypes')}</p>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button type="button" className="grid size-5 place-items-center rounded-full text-gray-4 transition-colors hover:bg-gray-7 hover:text-sub-2 focus-visible:outline-2 focus-visible:outline-main-1" aria-label="가능 근무 안내">
                                    <InfoIcon className="size-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">{t('page.member.detail.shiftTypesHint')}</TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="mt-5 grid w-full grid-cols-4 gap-2">
                        {writeNurse.nurseShiftTypes.map(({nurseShiftTypeId, isPossible, name, shortName}) => {
                            const baseColor = shiftTypeColorByName.get(name) ?? '#BFC7D4';
                            return (
                                <button
                                    key={nurseShiftTypeId}
                                    type="button"
                                    disabled={isBusy}
                                    className={cn(
                                        'inline-flex w-full cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-[5px] border px-3 py-1.5 font-apple text-[15px] transition-[background-color,color,border-color,opacity,transform,filter] duration-150 hover:-translate-y-[1px] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-main-1 disabled:cursor-not-allowed disabled:opacity-50',
                                    )}
                                    style={isPossible ? {borderColor: baseColor, backgroundColor: baseColor, color: '#FFFFFF'} : {borderColor: 'transparent', backgroundColor: '#ECEFF3', color: '#6B7280'}}
                                    onClick={() => {
                                        setWriteNurse((prev) =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      nurseShiftTypes: produce(prev.nurseShiftTypes, (draft) => {
                                                          const target = draft.find((x) => x.nurseShiftTypeId === nurseShiftTypeId);
                                                          if (target) target.isPossible = !isPossible;
                                                      }),
                                                  }
                                                : prev,
                                        );
                                        sendEvent(events.memberPage.editNurseDrawer.changeNurseShiftTypes);
                                    }}
                                >
                                    <span className="relative inline-flex h-[16px] w-[14px] items-center justify-center overflow-hidden">
                                        <span className={cn('absolute inset-0 flex items-center justify-center font-medium transition-all duration-200', isPossible ? 'scale-75 opacity-0' : 'scale-100 opacity-100')}>
                                            {shortName || ''}
                                        </span>
                                        <Check className={cn('absolute h-3.5 w-3.5 transition-all duration-200', isPossible ? 'scale-100 opacity-100' : 'scale-75 opacity-0')} strokeWidth={3} />
                                    </span>
                                    <span className="font-normal">{name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="px-[30px] py-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="font-apple text-[16px] font-medium text-sub-2">프리셉터</p>
                            <button
                                type="button"
                                role="checkbox"
                                aria-checked={Boolean(writeNurse.isWardManager)}
                                disabled={isBusy}
                                className={cn(
                                    'group flex h-5 w-5 items-center justify-center rounded-[5px] border transition-colors focus-visible:outline-2 focus-visible:outline-main-1 disabled:opacity-50',
                                    writeNurse.isWardManager
                                        ? 'border-main-1 bg-main-1 text-white'
                                        : 'border-sub-4 bg-white text-transparent hover:border-2 hover:border-main-1 hover:bg-main-light',
                                )}
                                onClick={() =>
                                    void updateNurseField((prev) => ({
                                        ...prev,
                                        isWardManager: !prev.isWardManager,
                                    }))
                                }
                            >
                                <Check className="h-3.5 w-3.5 stroke-[3] transition-[stroke-width] duration-150 group-hover:stroke-[3.6]" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-apple text-[16px] font-medium text-sub-2">근무투입</p>
                            <Switch
                                checked={writeNurse.isWorker}
                                disabled={isBusy}
                                onCheckedChange={(checked) => void updateNurseField((prev) => ({...prev, isWorker: checked}))}
                                className="relative h-5 w-9 justify-start border-0 bg-sub-4 p-0 shadow-none data-[state=checked]:bg-main-1 data-[state=unchecked]:bg-sub-4"
                                thumbClassName="absolute top-0.5 left-0.5 h-4 w-4 translate-x-0 bg-white shadow-sm data-[state=checked]:translate-x-4"
                                aria-label={`${writeNurse.name} 근무투입`}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-apple text-[16px] font-medium text-sub-2">근무표 관리자</p>
                            <button
                                type="button"
                                role="checkbox"
                                aria-checked={writeNurse.isDutyManager}
                                disabled={isBusy}
                                className={cn(
                                    'group flex h-5 w-5 items-center justify-center rounded-[5px] border transition-colors focus-visible:outline-2 focus-visible:outline-main-1 disabled:opacity-50',
                                    writeNurse.isDutyManager
                                        ? 'border-main-1 bg-main-1 text-white'
                                        : 'border-sub-4 bg-white text-transparent hover:border-2 hover:border-main-1 hover:bg-main-light',
                                )}
                                onClick={() => void updateNurseField((prev) => ({...prev, isDutyManager: !prev.isDutyManager}))}
                            >
                                <Check className="h-3.5 w-3.5 stroke-[3] transition-[stroke-width] duration-150 group-hover:stroke-[3.6]" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-[30px] py-6">
                    <p className="font-apple text-[16px] font-medium text-sub-2">메모</p>
                    <textarea
                        name="nurseMemo"
                        aria-label={t('page.member.detail.memo')}
                        value={writeNurse.memo ?? ''}
                        disabled={isBusy}
                        className="mt-3 h-[125px] w-full resize-none rounded-[10px] border border-gray-6 bg-[#FDFCFE] p-4 font-apple text-[16px] text-sub-1 focus-visible:outline-2 focus-visible:outline-main-1"
                        onChange={(event) => setWriteNurse((prev) => (prev ? {...prev, memo: event.target.value} : prev))}
                        onBlur={() => void autoSaveDraft(writeNurse)}
                    />
                    <div className="pt-4">
                        <button
                            type="button"
                            disabled={isBusy}
                            className="h-9 w-full rounded-[10px] bg-[#FEECEC] px-4 font-apple text-[15px] font-semibold text-[#D14343] transition-colors hover:bg-[#FCDDDD] disabled:opacity-50"
                            onClick={() => setDeleteConfirmModalOpen(true)}
                        >
                            간호사 삭제하기
                        </button>
                    </div>
                </div>

                {connectionGuideModalOpen ? (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-6" onClick={() => setConnectionGuideModalOpen(false)}>
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`member-connection-modal-title-${selectedNurse.nurseId}`}
                            aria-describedby={`member-connection-modal-description-${selectedNurse.nurseId}`}
                            className="w-full max-w-[520px] rounded-[20px] bg-white px-8 py-7"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <h2 id={`member-connection-modal-title-${selectedNurse.nurseId}`} className="font-apple text-[28px] font-semibold text-sub-1">
                                병동코드 안내
                            </h2>
                            <p
                                id={`member-connection-modal-description-${selectedNurse.nurseId}`}
                                className="mt-3 whitespace-pre-line font-apple text-[18px] text-gray-3"
                            >
                                간호사에게 병동코드를 전달하면 듀팅앱에서 등록 후 병동에 참여할 수 있어요.
                            </p>
                            <div className="mt-5 rounded-[12px] border border-main-4 bg-main-light px-5 py-4">
                                <p className="font-apple text-[14px] font-medium text-gray-3">병동코드</p>
                                <p className="mt-1 text-center font-poppins text-[28px] font-extrabold tracking-[0.08em] text-main-1">{wardCode || '-'}</p>
                            </div>
                            <div className="mt-7 flex justify-end">
                                <button
                                    type="button"
                                    className="rounded-[10px] bg-main-1 px-5 py-2.5 font-apple text-[16px] font-semibold text-white transition-colors hover:bg-main-2"
                                    onClick={() => setConnectionGuideModalOpen(false)}
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
                {disconnectConfirmModalOpen ? (
                    <div
                        className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/45 px-4"
                        onClick={() => setDisconnectConfirmModalOpen(false)}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            className="w-full max-w-[440px] rounded-[16px] bg-white px-6 py-5"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <p className="font-apple text-[20px] font-semibold text-sub-1">연동을 끊을까요?</p>
                            <p className="mt-2 font-apple text-[15px] text-gray-3">
                                <span className="font-semibold text-sub-1">{writeNurse.name || '선택한 간호사'}</span>
                                {' 의 앱 연동을 끊어요.'}
                            </p>
                            <div className="mt-6 flex items-center gap-3">
                                <button
                                    type="button"
                                    className="h-11 flex-1 rounded-[10px] bg-[#F3F4F6] px-6 font-apple text-[16px] font-semibold text-gray-3 transition-colors hover:bg-[#EAECEF]"
                                    onClick={() => setDisconnectConfirmModalOpen(false)}
                                >
                                    닫기
                                </button>
                                <button
                                    type="button"
                                    className="h-11 flex-1 rounded-[10px] bg-[#D14343] px-6 font-apple text-[16px] font-semibold text-white transition-colors hover:bg-[#BD3434]"
                                    onClick={async () => {
                                        const ok = await disconnectNurse(writeNurse.nurseId);
                                        if (ok) {
                                            setDisconnectConfirmModalOpen(false);
                                        }
                                    }}
                                >
                                    연동 끊기
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
                {deleteConfirmModalOpen ? createPortal(
                    <div className="fixed inset-0 z-[1002] flex items-center justify-center bg-black/45 px-4" onClick={() => setDeleteConfirmModalOpen(false)}>
                        <div
                            role="dialog"
                            aria-modal="true"
                            className="w-full max-w-[440px] rounded-[16px] bg-white px-6 py-5"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <p className="font-apple text-[20px] font-semibold text-sub-1">간호사를 삭제할까요?</p>
                            <p className="mt-2 font-apple text-[15px] text-gray-3">
                                <span className="font-semibold text-sub-1">{writeNurse.name || '선택한 간호사'}</span>
                                {' 삭제 후에는 되돌릴 수 없어요.'}
                            </p>
                            <div className="mt-6 flex items-center gap-3">
                                <button
                                    type="button"
                                    className="h-11 flex-1 rounded-[10px] bg-[#F3F4F6] px-6 font-apple text-[16px] font-semibold text-gray-3 transition-colors hover:bg-[#EAECEF]"
                                    onClick={() => setDeleteConfirmModalOpen(false)}
                                >
                                    닫기
                                </button>
                                <button
                                    type="button"
                                    className="h-11 flex-1 rounded-[10px] bg-[#D14343] px-6 font-apple text-[16px] font-semibold text-white transition-colors hover:bg-[#BD3434]"
                                    onClick={async () => {
                                        setDeleteConfirmModalOpen(false);
                                        if (!writeNurse.shiftTeamId) return;
                                        await deleteNurse(writeNurse.shiftTeamId, writeNurse.nurseId);
                                    }}
                                >
                                    삭제하기
                                </button>
                            </div>
                        </div>
                    </div>,
                    modalRoot,
                ) : null}
            </aside>
        </TooltipProvider>
    );
}

export default NurseDetailPanel;

