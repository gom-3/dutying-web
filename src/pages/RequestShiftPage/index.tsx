import useRequestShift from '@hooks/shift/useRequestShift';
import RequestCalendar from './components/RequestCalendar';
import Toolbar from './components/Toolbar';

const RequestShiftPage = () => {
  useRequestShift(true);
  return (
    <div className="mx-auto flex h-screen w-fit min-w-[104.625rem] flex-col">
      <Toolbar />
      <RequestCalendar />
    </div>
  );
};

export default RequestShiftPage;
