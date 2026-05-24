import {useTutorialStore} from './model/store';

const useTutorialUseCase = () => {
    const initTutorial = useTutorialStore((state) => state.resetTutorial);
    const setMakeTutorial = useTutorialStore((state) => state.setMakeTutorial);
    const setMemberTutorial = useTutorialStore((state) => state.setMemberTutorial);
    const setRequestTutorial = useTutorialStore((state) => state.setRequestTutorial);

    return {
        initTutorial,
        setMakeTutorial,
        setMemberTutorial,
        setRequestTutorial,
    };
};

export default useTutorialUseCase;
