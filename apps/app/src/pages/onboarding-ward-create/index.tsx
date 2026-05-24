import {ArrowRight, Trash2} from 'lucide-react';
import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router';
import useAuth from '@/features/auth';
import skillBubbleBadgeIcon from '@/shared/assets/images/skill-bubble-badge.png';
import {isOnboardingWardCreatePreviewAllowed} from '@/shared/config/feature-flags';
import ROUTE from '@/shared/constant/path';
import {useOnboardingWardWizard} from './model';
import HeaderLogo from './ui/header-logo';
import OnboardingStepLayout from './ui/onboarding-step-layout';
import SectionHeader from './ui/section-header';
import NurseStep from './ui/steps/nurse-step';
import ShiftTypeStep from './ui/steps/shift-type-step';
import SkillLevelModal from './ui/steps/skill-level-modal';
import UploadStep from './ui/steps/upload-step';
import WardIdentityStep from './ui/steps/ward-identity-step';
import WizardButton from './ui/wizard-button';

function OnboardingWardCreatePage() {
    const navigate = useNavigate();
    const {
        state: {accountMe},
    } = useAuth();
    const {
        draft,
        activeTeamId,
        setSelectedTeamId,
        sortMode,
        setSortMode,
        showSkillModal,
        setShowSkillModal,
        isSkillLevelEnabled,
        goNextStep,
        goPreviousStep,
        updateWardIdentity,
        skipOrComplete,
        addShiftType,
        updateShiftType,
        deleteShiftType,
        addTeam,
        addNurse,
        deleteActiveTeam,
        deleteNurse,
        updateNurse,
        updateTeamName,
        handleNurseDragEnd,
        applyUploadedFile,
        uploadStatus,
        uploadError,
        uploadWarnings,
        saveSkillConfig,
        disableSkillConfig,
        complete,
        canGoNext,
        canComplete,
        submissionStatus,
        canAddTeam,
        currentStepValidation,
        completionValidationIssues,
    } = useOnboardingWardWizard();
    const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
    const [showIdentityNameError, setShowIdentityNameError] = useState(false);
    const isSubmitting = submissionStatus === 'submitting';
    const isSuccess = submissionStatus === 'success';
    const actionsDisabled = isSubmitting || isSuccess;
    const isNurseRegistrationStep = draft.currentStep === 4;
    const isUploadStep = draft.currentStep === 2;
    const hasUploadedFile = Boolean(draft.uploadedFileName);
    const activeTeam = draft.teams.find((team) => team.id === activeTeamId);
    const activeTeamNurseCount = draft.nurses.filter((nurse) => nurse.teamId === activeTeamId).length;
    const openSkillModal = () => setShowSkillModal(true);
    const getNextBlockedReasonMessage = () => {
        if (isSubmitting) {
            return '병동을 생성하고 있어요. 잠시만 기다려 주세요.';
        }

        if (isSuccess) {
            return '이미 병동 생성을 마쳤어요.';
        }

        if (isUploadStep && !hasUploadedFile) {
            return '근무표 파일을 업로드하거나 건너뛰기를 눌러주세요.';
        }

        const blockingIssues = draft.currentStep === 4 && !canComplete ? completionValidationIssues : currentStepValidation.issues;
        const codes = new Set(blockingIssues.map((issue) => issue.code));

        if (codes.has('missing-hospital-name')) {
            return '병원명 또는 병동명을 입력해 주세요.';
        }

        if (codes.has('invalid-ward-name') || codes.has('invalid-hospital-name')) {
            return '입력값은 한글, 영문, 숫자, 공백만 1~20자로 입력해 주세요.';
        }

        if (codes.has('empty-team-nurses')) {
            return '간호사 없는 팀이 있어요. 간호사를 추가하거나 팀을 삭제해 주세요.';
        }

        if (codes.has('empty-team')) {
            return '팀을 추가하면 병동을 만들 수 있어요.';
        }

        if (codes.has('missing-nurse-name') || codes.has('invalid-nurse-name')) {
            return '간호사 이름을 확인해 주세요.';
        }

        if (codes.has('duplicate-shift-name') || codes.has('duplicate-shift-short-name')) {
            return '중복된 근무명 또는 약자가 있어요.';
        }

        if (codes.has('missing-shift-time') || codes.has('invalid-shift-time-format') || codes.has('invalid-shift-time-order')) {
            return '근무 시간을 확인해 주세요.';
        }

        if (codes.has('missing-shift-name') || codes.has('missing-shift-short-name') || codes.has('empty-shift-types')) {
            return '근무 유형 정보를 확인해 주세요.';
        }

        return '입력 정보를 확인해 주세요.';
    };
    const handleIdentityNameEnter = () => {
        if (actionsDisabled) {
            return;
        }

        if (canGoNext) {
            setShowIdentityNameError(false);
            goNextStep();

            return;
        }

        if (draft.currentStep === 1) {
            setShowIdentityNameError(true);
            document.getElementById('onboarding-identity-name')?.focus();
        }
        toast.error(getNextBlockedReasonMessage());
    };
    const headerAside =
        draft.currentStep === 4 ? (
            <div className="space-y-3">
                <button
                    type="button"
                    aria-label="숙련도 설정"
                    className="group relative w-full cursor-pointer rounded-[16px] bg-[#E9E4FF] px-6 py-5 pr-16 text-left transition-colors duration-200 before:absolute before:inset-0 before:rounded-[16px] before:bg-[#DDD2FF] before:opacity-0 before:transition-opacity before:duration-200 before:content-[''] group-hover:before:opacity-100 after:absolute after:right-8 after:-bottom-2.5 after:h-5 after:w-5 after:rotate-45 after:rounded-[2px] after:bg-[#E9E4FF] after:transition-colors after:duration-200 after:content-[''] group-hover:after:bg-[#DDD2FF] focus-visible:ring-2 focus-visible:ring-main-1/25 focus-visible:outline-none"
                    onClick={openSkillModal}
                >
                    <img
                        src={skillBubbleBadgeIcon}
                        alt=""
                        className="pointer-events-none absolute -top-[17px] -left-[15px] z-20 h-[37px] w-[37px]"
                    />
                    <div className="relative z-10 space-y-1.5">
                        <p className="font-apple text-[19px] font-semibold text-[#5E45C1]">간호사 숙련도를 설정해볼까요?</p>
                        <p className="font-apple text-[16px] text-gray-3">근무표 작성시, 숙련도에 따라 자동으로 배정할 수 있어요</p>
                    </div>
                    <span className="pointer-events-none absolute top-1/2 right-5 z-10 -translate-y-1/2 text-[#6A4AE1] transition-transform duration-200 group-hover:translate-x-0.5">
                        <ArrowRight className="h-6 w-6" />
                    </span>
                </button>
            </div>
        ) : undefined;

    useEffect(() => {
        if (isOnboardingWardCreatePreviewAllowed()) return;

        if (accountMe && accountMe.status !== 'WARD_SELECT_PENDING') {
            navigate(ROUTE.REGISTER);
        }
    }, [accountMe, navigate]);

    useEffect(() => {
        if (!isSuccess) {
            return;
        }

        const navigateTimer = window.setTimeout(() => {
            navigate(`${ROUTE.DUTY}?onboardingWardCreated=1`, {replace: true});
        }, 1000);

        return () => window.clearTimeout(navigateTimer);
    }, [isSuccess, navigate]);

    const stepContent = (() => {
        switch (draft.currentStep) {
            case 1:
                return (
                    <WardIdentityStep
                        identityName={
                            draft.hospitalName && draft.wardName && draft.hospitalName !== draft.wardName
                                ? `${draft.hospitalName} ${draft.wardName}`
                                : draft.hospitalName || draft.wardName
                        }
                        hasError={showIdentityNameError}
                        onIdentityNameChange={(identityName) => {
                            if (showIdentityNameError && identityName.trim()) {
                                setShowIdentityNameError(false);
                            }
                            updateWardIdentity({
                                hospitalName: identityName,
                                wardName: identityName,
                            });
                        }}
                        onIdentityNameEnter={handleIdentityNameEnter}
                    />
                );
            case 2:
                return (
                    <UploadStep
                        draft={draft}
                        onUpload={(file) => void applyUploadedFile(file)}
                        isUploading={uploadStatus === 'uploading'}
                        uploadError={uploadError}
                        uploadWarnings={uploadWarnings}
                    />
                );
            case 3:
                return (
                    <ShiftTypeStep
                        shiftTypes={draft.shiftTypes}
                        onChange={updateShiftType}
                        onAdd={addShiftType}
                        onDelete={deleteShiftType}
                    />
                );
            case 4:
                return (
                    <NurseStep
                        draft={draft}
                        selectedTeamId={activeTeamId}
                        showSkillColumn={isSkillLevelEnabled}
                        sortMode={sortMode}
                        onSortModeChange={setSortMode}
                        onSelectTeam={setSelectedTeamId}
                        onAddTeam={addTeam}
                        canAddTeam={canAddTeam}
                        onAddNurse={addNurse}
                        onDeleteNurse={deleteNurse}
                        onNurseChange={updateNurse}
                        onTeamNameChange={updateTeamName}
                        onDragEnd={handleNurseDragEnd}
                    />
                );
            default:
                return null;
        }
    })();
    const modalRoot = document.getElementById('modal-root') ?? document.body;

    return (
        <div className="relative min-h-screen bg-[#FAF8FB]">
            <HeaderLogo />
            <SkillLevelModal
                open={showSkillModal}
                config={draft.skillLevelConfig}
                onClose={() => setShowSkillModal(false)}
                onSave={saveSkillConfig}
                onDisable={() => {
                    disableSkillConfig();
                    setShowSkillModal(false);
                }}
            />
            {showDeleteTeamModal && activeTeam
                ? createPortal(
                      <div className="fixed inset-0 z-[100001] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[1px]">
                          <div role="dialog" aria-modal="true" className="w-full max-w-[440px] rounded-[16px] bg-white px-6 py-5">
                              <p className="font-apple text-[20px] font-semibold text-sub-1">팀을 삭제할까요?</p>
                              <p className="mt-2 font-apple text-[15px] text-gray-3">
                                  <span className="font-semibold text-sub-1">{activeTeam.name}</span>
                                  {` 팀을 삭제하면 소속 간호사 ${activeTeamNurseCount}명도 함께 삭제돼요.`}
                              </p>
                              <div className="mt-5 flex justify-end gap-2">
                                  <button
                                      type="button"
                                      className="rounded-[8px] px-4 py-2 font-apple text-[14px] font-medium text-gray-3 transition-colors hover:bg-gray-7"
                                      onClick={() => setShowDeleteTeamModal(false)}
                                  >
                                      닫기
                                  </button>
                                  <button
                                      type="button"
                                      className="rounded-[8px] bg-[#D14343] px-4 py-2 font-apple text-[14px] font-semibold text-white transition-colors hover:bg-[#BD3434]"
                                      onClick={() => {
                                          deleteActiveTeam();
                                          setShowDeleteTeamModal(false);
                                      }}
                                  >
                                      삭제하기
                                  </button>
                              </div>
                          </div>
                      </div>,
                      modalRoot,
                  )
                : null}
            <div className="mx-auto w-[1120px] pt-[100px] pb-20">
                <SectionHeader step={draft.currentStep} aside={headerAside} />
                <OnboardingStepLayout
                    step={draft.currentStep}
                    onPrev={goPreviousStep}
                    onNext={() => {
                        if (draft.currentStep === 1) {
                            setShowIdentityNameError(false);
                        }

                        if (draft.currentStep < 4) {
                            goNextStep();
                            return;
                        }

                        void complete();
                    }}
                    onNextDisabledClick={() => {
                        if (draft.currentStep === 1) {
                            setShowIdentityNameError(true);
                            document.getElementById('onboarding-identity-name')?.focus();
                        }
                        toast.error(getNextBlockedReasonMessage());
                    }}
                    leftAction={
                        isUploadStep ? (
                            <WizardButton variant="link" className="text-[18px]" disabled={actionsDisabled} onClick={skipOrComplete}>
                                건너뛰기
                            </WizardButton>
                        ) : isNurseRegistrationStep ? (
                            <WizardButton
                                variant="link"
                                className="flex items-center gap-2 px-0 text-[18px] text-[#C55252] no-underline hover:bg-transparent hover:text-[#A53F3F]"
                                disabled={actionsDisabled || !activeTeam}
                                onClick={() => {
                                    if (activeTeamNurseCount === 0) {
                                        deleteActiveTeam();

                                        return;
                                    }

                                    setShowDeleteTeamModal(true);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />팀 삭제하기
                            </WizardButton>
                        ) : undefined
                    }
                    nextDisabled={
                        draft.currentStep < 4
                            ? !canGoNext || (isUploadStep && !hasUploadedFile) || isSubmitting || isSuccess
                            : !canComplete || isSubmitting || isSuccess
                    }
                    actionsDisabled={actionsDisabled}
                    nextLabel={draft.currentStep < 4 ? '다음' : isSubmitting ? '생성 중...' : isSuccess ? '생성 완료' : '완료'}
                >
                    {stepContent}
                </OnboardingStepLayout>
            </div>
        </div>
    );
}

export default OnboardingWardCreatePage;
