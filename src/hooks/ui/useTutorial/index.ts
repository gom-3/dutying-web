import { shallow } from 'zustand/shallow';
import { useTutorialStore } from './store';

const useTutorial = () => {
  const [showMakeTutorial, showMemberTutorial, showRequestTutorial, setState, initState] =
    useTutorialStore(
      (state) => [
        state.showMakeTutorial,
        state.showMemberTutorial,
        state.showRequestTutorial,
        state.setState,
        state.initState,
      ],
      shallow
    );

  return {
    state: {
      showMakeTutorial,
      showMemberTutorial,
      showRequestTutorial,
    },
    actions: {
      initTutorial: initState,
      setMakeTutorial: (showMakeTutorial: boolean) =>
        setState('showMakeTutorial', showMakeTutorial),
      setMemberTutorial: (showMemberTutorial: boolean) =>
        setState('showMemberTutorial', showMemberTutorial),
      setRequestTutorial: (showRequestTutorial: boolean) =>
        setState('showRequestTutorial', showRequestTutorial),
    },
  };
};

export default useTutorial;
