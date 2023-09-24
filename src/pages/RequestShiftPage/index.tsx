import Toolbar from './components/Toolbar';
import RequestCalendar from './components/RequestCalendar';
import useRequestShift from '@hooks/shift/useRequestShift';

const RequestPage = () => {
  const {
    state: { shiftStatus },
  } = useRequestShift(true);

  return shiftStatus === 'success' ? (
    <div className="mx-auto flex h-screen w-fit min-w-[82rem] flex-col overflow-hidden">
      <Toolbar />
      <RequestCalendar isEditable />
    </div>
  ) : null;
};

export default RequestPage;
