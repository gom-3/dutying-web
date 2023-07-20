import Toolbar from './components/Toolbar';
import DutyCalendar from './components/DutyCalendar';
import { useState } from 'react';
import useRequestShiftPageHook from './index.hook';

const RequestPage = () => {
  const {
    state: { month, focus, requestShift },
    actions: { changeFocus },
  } = useRequestShiftPageHook();
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

  return requestShift ? (
    <div className="mx-auto flex h-screen w-fit flex-col overflow-hidden">
      <Toolbar
        month={month}
        requestShift={requestShift}
        selectedNurse={selectedNurse}
        setSelectedNurse={setSelectedNurse}
      />
      <DutyCalendar
        month={month}
        requestShift={requestShift}
        selectedNurse={selectedNurse}
        focus={focus}
        handleFocusChange={changeFocus}
        isEditable
      />
    </div>
  ) : null;
};

export default RequestPage;
