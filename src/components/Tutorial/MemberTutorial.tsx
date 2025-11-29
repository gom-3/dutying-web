import {useEffect} from 'react';
import {createPortal} from 'react-dom';
import useTutorial from '@/hooks/ui/useTutorial';
import useEditShiftTeam from '@/hooks/ward/useEditShiftTeam';
import {type StepConfig, type StepsConfig, TutorialOverlay} from './TutorialOverlay';

const MemberTutorial = () => {
    const {
        state: {showMemberTutorial},
        actions: {setMemberTutorial},
    } = useTutorial();
    const {
        state: {shiftTeams},
        actions: {selectNurse},
    } = useEditShiftTeam();
    const config: StepsConfig = {
        steps: new Map<number, StepConfig>(),
        infoBoxHeight: 150,
        infoBoxMargin: 20,
        scrollLock: true,
    };

    config.steps.set(1, {
        highlightIds: ['ward_info'],
        title: '간호사 관리하기',
        info: '이곳에서 병동의 정보를 확인할 수 있어요',
        infoBoxAlignment: 'left',
    });

    config.steps.set(2, {
        highlightIds: ['shift_team_list'],
        title: '간호사 관리하기',
        info: '이곳에서 근무팀에 속한 간호사의 정보를 확인할 수 있어요.',
        infoBoxAlignment: 'left',
        onNextStep: () => {
            if (shiftTeams) {
                selectNurse(shiftTeams[0].nurses[0].nurseId);
            }
        },
    });

    config.steps.set(3, {
        highlightIds: ['nurse_sample'],
        title: '간호사 관리하기',
        info: '간호사 이름을 눌러 편집해보세요!',
        infoBoxAlignment: 'center',
        onPrevStep: () => {
            selectNurse(null);
        },
    });

    config.steps.set(4, {
        highlightIds: ['nurse_edit_drawer'],
        title: '간호사 관리하기',
        info: '편집을 완료하고 하단에 저장을 눌러주세요! \n더 자세한 가이드는 메뉴얼 문서를 참고해주세요!',
        ctaText: '메뉴얼 보러가기',
        ctaUrl: 'https://gom3.notion.site/befb4602f83241ed896a1700eb592b35?pvs=4',

        infoBoxAlignment: 'right',
        onNextStep: () => {
            selectNurse(null);
        },
    });

    useEffect(() => {
        if (showMemberTutorial) {
            selectNurse(null);
        }
    }, [showMemberTutorial]);

    return (
        showMemberTutorial &&
        createPortal(
            <TutorialOverlay config={config} closeCallback={() => setMemberTutorial(false)} />,
            document.getElementById('tutorial')!,
        )
    );
};

export default MemberTutorial;
