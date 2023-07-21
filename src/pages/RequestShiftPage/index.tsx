import Toolbar from './components/Toolbar';
import RequestCalendar from './components/RequestCalendar';
import { useState } from 'react';
import useRequestShiftPageHook from './index.hook';

const RequestPage = () => {
  const {
    state: { month, focus, requestShift, changeStatus, foldedLevels },
    actions: { changeFocus, foldLevel },
  } = useRequestShiftPageHook();
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

  return requestShift ? (
    <div className="mx-auto flex h-screen w-fit min-w-[82rem] flex-col overflow-hidden">
      <Toolbar
        month={month}
        requestShift={requestShift}
        selectedNurse={selectedNurse}
        changeStatus={changeStatus}
        setSelectedNurse={setSelectedNurse}
      />
      <RequestCalendar
        month={month}
        requestShift={requestShift}
        selectedNurse={selectedNurse}
        focus={focus}
        foldedLevels={foldedLevels}
        handleFocusChange={changeFocus}
        foldLevel={foldLevel}
        isEditable
      />
    </div>
  ) : null;
};

export default RequestPage;
