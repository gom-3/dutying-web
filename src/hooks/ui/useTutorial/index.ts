import { shallow } from 'zustand/shallow';
import { useTutorialStore } from './store';

const useTutorial = () => {
  const [showMakeTutorial, showManageTutorial, showRequestTutorial, setState] = useTutorialStore(
    (state) => [
      state.showMakeTutorial,
      state.showManageTutorial,
      state.showRequestTutorial,
      state.setState,
    ],
    shallow
  );

  return {
    state: {
      showMakeTutorial,
      showManageTutorial,
      showRequestTutorial,
    },
    actions: {
      setMakeTutorial: (showMakeTutorial: boolean) =>
        setState('showMakeTutorial', showMakeTutorial),
      setManageTutorial: (showManageTutorial: boolean) =>
        setState('showManageTutorial', showManageTutorial),
      setRequestTutorial: (showRequestTutorial: boolean) =>
        setState('showRequestTutorial', showRequestTutorial),
    },
  };
};

export default useTutorial;
