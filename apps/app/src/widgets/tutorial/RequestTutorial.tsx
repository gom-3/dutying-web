import {useEffect, useMemo} from 'react';
import useAuth from '@/features/auth';
import useRequestShift from '@/features/request-shift';
import {useRequestShiftStore} from '@/features/request-shift/model/store';
import useTutorialUseCase from '@/features/tutorial';
import {useTutorialStore} from '@/features/tutorial/model/store';
import {useTutorialDismissPersistence} from '@/features/tutorial/model/use-tutorial-dismiss-persistence';
import {RUNTIME_CONFIG} from '@/shared/config/runtime';
import {type ITutorialConfig} from './tutorial.types';
import {TutorialPortal} from './TutorialPortal';

const RequestTutorial = () => {
    const showRequestTutorial = useTutorialStore((state) => state.showRequestTutorial);
    const {setRequestTutorial} = useTutorialUseCase();
    const {
        state: {accountId},
    } = useAuth();
    const onTutorialClose = useTutorialDismissPersistence('request', accountId, setRequestTutorial);
    /**
     * 로딩 완료 + 툴바가 DOM에 올라온 뒤에만 튜토리얼이 뜨도록 수정
     */
    const {
        state: {bootstrapStatus, shiftTeamsStatus, shiftTeams},
        actions: {toggleEditMode},
    } = useRequestShift();
    const isToolbarReady = bootstrapStatus === 'success' && shiftTeamsStatus === 'success' && (shiftTeams?.length ?? 0) > 0;
    const {setState} = useRequestShiftStore();
    const config = useMemo<ITutorialConfig>(
        () => ({
            steps: [
                {
                    highlightIds: ['toolbar'],
                    title: '신청근무 작성하기',
                    info: '여기는 툴바예요. 신청근무 작성에 도움이 되는 여러 설정을 바꿀 수 있어요',
                    infoBoxAlignment: 'left',
                },
                {
                    highlightIds: ['calendar'],
                    title: '신청근무 작성하기',
                    info: '여기는 신청 근무표예요. 툴바의 "수정하기" 버튼을 누른 뒤 셀을 클릭해 신청 근무를 작성할 수 있어요',
                    infoBoxAlignment: 'left',
                },
                {
                    highlightIds: ['nurse_request_list'],
                    title: '신청근무 작성하기',
                    info: '여기에서 연동된 간호사의 신청 근무를 볼 수 있어요',
                    infoBoxAlignment: 'right',
                },
                {
                    highlightIds: ['editButton'],
                    title: '신청근무 작성하기',
                    info: '수정하기 버튼을 눌러서 신청 근무표를 만들 수 있어요',
                    infoBoxAlignment: 'right',
                    onNextStep: toggleEditMode,
                },
                {
                    highlightIds: ['cell_sample'],
                    title: '신청근무 작성하기',
                    info: '셀을 클릭하고 D E N O를 입력하면 신청근무를 작성할 수 있어요.\n더 자세한 가이드는 매뉴얼 문서를 참고해 주세요.',
                    infoBoxAlignment: 'center',
                    onPrevStep: toggleEditMode,
                    ctaText: '매뉴얼 보러가기',
                    ctaUrl: RUNTIME_CONFIG.docs.requestTutorial,
                },
            ],
            infoBoxHeight: 150,
            infoBoxMargin: 20,
            scrollLock: true,
        }),
        [toggleEditMode],
    );

    useEffect(() => {
        if (showRequestTutorial) {
            setState('readonly', true);
        }
    }, [showRequestTutorial]);

    /**
     * 로딩 완료 + 툴바가 DOM에 올라온 뒤에만 튜토리얼이 뜨도록 수정
     */
    return <TutorialPortal open={showRequestTutorial && isToolbarReady} config={config} closeCallback={onTutorialClose} />;
};

export default RequestTutorial;
