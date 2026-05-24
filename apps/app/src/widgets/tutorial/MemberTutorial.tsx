import {useEffect, useMemo} from 'react';
import useAuth from '@/features/auth';
import useEditShiftTeam from '@/features/edit-shift-team';
import useTutorialUseCase from '@/features/tutorial';
import {useTutorialStore} from '@/features/tutorial/model/store';
import {useTutorialDismissPersistence} from '@/features/tutorial/model/use-tutorial-dismiss-persistence';
import {RUNTIME_CONFIG} from '@/shared/config/runtime';
import {type ITutorialConfig} from './tutorial.types';
import {TutorialPortal} from './TutorialPortal';

const MemberTutorial = () => {
    const showMemberTutorial = useTutorialStore((state) => state.showMemberTutorial);
    const {setMemberTutorial} = useTutorialUseCase();
    const {
        state: {accountId},
    } = useAuth();
    const onTutorialClose = useTutorialDismissPersistence('member', accountId, setMemberTutorial);
    const {
        state: {shiftTeams},
        actions: {selectNurse},
    } = useEditShiftTeam();
    const config = useMemo<ITutorialConfig>(
        () => ({
            steps: [
                {
                    highlightIds: ['ward_info'],
                    title: '간호사 관리하기',
                    info: '여기에서 병동 정보를 확인할 수 있어요',
                    infoBoxAlignment: 'left',
                },
                {
                    highlightIds: ['shift_team_list'],
                    title: '간호사 관리하기',
                    info: '여기에서 근무팀에 속한 간호사 정보를 확인할 수 있어요.',
                    infoBoxAlignment: 'left',
                    onNextStep: () => {
                        const firstNurseId = shiftTeams?.[0]?.nurses?.[0]?.nurseId;

                        if (typeof firstNurseId === 'number') {
                            selectNurse(firstNurseId);
                        }
                    },
                },
                {
                    highlightIds: ['nurse_sample'],
                    title: '간호사 관리하기',
                    info: '간호사 이름을 눌러 편집해 보세요.',
                    infoBoxAlignment: 'center',
                    onPrevStep: () => {
                        selectNurse(null);
                    },
                },
                {
                    highlightIds: ['nurse_edit_drawer'],
                    title: '간호사 관리하기',
                    info: '편집을 마치면 하단의 저장을 눌러 주세요.\n더 자세한 가이드는 매뉴얼 문서를 참고해 주세요.',
                    ctaText: '매뉴얼 보러가기',
                    ctaUrl: RUNTIME_CONFIG.docs.memberTutorial,
                    infoBoxAlignment: 'right',
                    onNextStep: () => {
                        selectNurse(null);
                    },
                },
            ],
            infoBoxHeight: 150,
            infoBoxMargin: 20,
            scrollLock: true,
        }),
        [selectNurse, shiftTeams],
    );

    useEffect(() => {
        if (showMemberTutorial) {
            selectNurse(null);
        }
    }, [showMemberTutorial]);

    return <TutorialPortal open={showMemberTutorial} config={config} closeCallback={onTutorialClose} />;
};

export default MemberTutorial;
