import Toolbar from './components/Toolbar';
import DutyCalendar from './components/DutyCalendar';
import { useState } from 'react';
import RequestShiftPageViewModel from './index.viewmodel';

const RequestPage = () => {
  const {
    state: { focus, requestShift },
    actions: { changeFocus },
  } = RequestShiftPageViewModel();
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

  return requestShift ? (
    <div className="mx-auto flex h-screen w-fit flex-col overflow-hidden">
      <Toolbar
        requestShift={requestShift}
        selectedNurse={selectedNurse}
        setSelectedNurse={setSelectedNurse}
      />
      <DutyCalendar
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
