import { Step } from '@pages/OnboardingPage/components/useCreateWard';
import 'index.css';
import useOnclickOutside from 'react-cool-onclickoutside';

interface Props {
  steps: Step[];
  current: number;
  close: () => void;
}

const Modal = ({ steps, current, close }: Props) => {
  const ref = useOnclickOutside(() => {
    close();
  });
  return (
    <div
      ref={ref}
      className="absolute left-[50%] top-[50%] z-30 h-auto min-h-[22rem] w-[80%] shrink-0 translate-x-[-50%] translate-y-[-50%] rounded-[1.25rem] bg-white"
    >
      {steps[current].contents}
    </div>
  );
};

export default Modal;
