/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useTutorial from '@hooks/ui/useTutorial';
import { createPortal } from 'react-dom';
import { TutorialOverlay, StepConfig, StepsConfig } from 'react-tutorial-overlay';
import './index.css';
import { useCallback, useEffect, useReducer, useState } from 'react';
import useInterval from '@libs/util/useInterval';

const config: StepsConfig = {
  steps: new Map<number, StepConfig>(),
  infoBoxHeight: 150, // Height of the info box in px
  infoBoxMargin: 30, // Vertical distance from highlighted element and info box in px
  infoBoxThemeColor: '#9042dd', // Info box theme color (Title, buttons, shadow)
  darkerBackground: false, // Add darker overlay than original page
  scrollLock: true, // Locks scrolling until tutorial is displayed
  infoBoxShadow: true, // Should info box cast small shadow (Useful on white background).
  highlightBoxBorderColor: '#9042dd', // Border color of highlighted element.
  highlightBoxBorderRadius: 3, // Border radius of highlighted border (It is applied only on outer side).
  highlightBoxBorderWidth: 3, // Width of highlight border in px.
};

config.steps.set(1, {
  // 1 is element key and represents step number
  highlightIds: ['El1'], // HTML element id's for this step
  info: '수정하기를 눌러서 수정을 시작해요', // Info paragraph to be displayed in info box
  title: '근무표 만들기 페이지 가이드', // Title of the step
  infoBoxAlignment: 'center', // Info box alignment relative to highlighted element
});

config.steps.set(2, {
  // required
  highlightIds: ['El3', 'El2'], // required
  info: 'This is second step', // optional
  title: 'Hello again', // optional
  infoBoxAlignment: 'left', // optional
});

config.steps.set(3, {
  highlightIds: ['El4'],
  info: 'This is last step',
  title: 'Bye',
  infoBoxAlignment: 'center',
});

const MakeTutorial = () => {
  const {
    state: { showMakeTutorial },
    actions: { setMakeTutorial },
  } = useTutorial();
  const [state, setState] = useState(1);
  const forceUpdate = useCallback(() => setState(state + 1), []);

  useEffect(() => {
    const skip = document.querySelectorAll('.TutorialButton')[0];
    const previous = document.querySelectorAll('.TutorialButton')[1];
    const next = document.querySelectorAll('.TutorialButton')[2];
    if (skip) skip.innerHTML = '건너뛰기';
    if (previous) previous.innerHTML = '이전';
    if (next) {
      if (next.innerHTML === 'Finish') {
        next.innerHTML = '완료';
      } else {
        next.innerHTML = '다음';
      }
    }
  }, []);

  useInterval(() => {
    forceUpdate();
    console.log('hi');
  }, 500);

  return (
    showMakeTutorial &&
    createPortal(
      <TutorialOverlay config={config} closeCallback={() => setMakeTutorial(false)} />,
      document.getElementById('tutorial')!
    )
  );
};

export default MakeTutorial;
