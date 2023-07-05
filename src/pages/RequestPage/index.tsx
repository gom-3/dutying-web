import Toolbar from './components/Toolbar';
import DutyCalendar from './components/DutyCalendar';
import { useState } from 'react';
import useRequest from './components/useRequest';

const RequestPage = () => {
  const { requestDuty, focus, rowContainerRef, shiftList, focusedCellRef, handlers } = useRequest();
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

  return (
    <div className="mx-auto flex h-screen w-fit flex-col overflow-hidden">
      <Toolbar
        requestDuty={requestDuty}
        selectedNurse={selectedNurse}
        setSelectedNurse={setSelectedNurse}
      />
      <DutyCalendar
        duty={{ ...requestDuty, dutyRowsByLevel: requestDuty.requestRowsByLevel } as Duty}
        shiftList={shiftList}
        isEditable
        focus={focus}
        focusedCellRef={focusedCellRef}
        rowContainerRef={rowContainerRef}
        handleFocusChange={handlers.handleFocusChange}
        selectedNurse={selectedNurse}
      />
    </div>
  );
};

export default RequestPage;
