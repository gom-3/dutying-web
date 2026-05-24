import {createStore} from '@/shared/util/create-store';

const initialState = {
    showMakeTutorial: true,
    showRequestTutorial: true,
    showMemberTutorial: true,
};

export const useTutorialStore = createStore(initialState, {
    name: 'useTutorialStore',
    actions: ({set, reset}) => ({
        resetTutorial: reset,
        setMakeTutorial: (showMakeTutorial: boolean) => set('showMakeTutorial', showMakeTutorial),
        setRequestTutorial: (showRequestTutorial: boolean) => set('showRequestTutorial', showRequestTutorial),
        setMemberTutorial: (showMemberTutorial: boolean) => set('showMemberTutorial', showMemberTutorial),
    }),
});
