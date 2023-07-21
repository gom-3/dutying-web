import 'index.css';
import Setting from './components/Setting';
import Modal from './components/Modal';
import ShiftTypeSetting from './components/ShiftTypeSetting';
import SetShiftPageHook from './index.hook';

const SetShiftPage = () => {
  const {
    state: { isModalOpen, currentModal, ward },
    actions: {
      editWardSetting,
      closeModal,
      handleClickPenIcon,
      removeShiftType,
      editShiftType,
      addShiftType,
    },
  } = SetShiftPageHook();

  if (!ward) return <></>;

  return (
    <div className="relative h-[100vh] w-[100vw] overflow-y-scroll p-[3.4375rem]">
      {isModalOpen && (
        <Modal current={currentModal} close={closeModal} ward={ward} edit={editWardSetting} />
      )}
      <div className="mb-[3.625rem] font-apple text-[2.25rem] text-text-1">
        {ward.name}병동 근무 설정
      </div>
      <Setting
        name="숙련도"
        step="숙련도"
        value={'' + ward.levelDivision}
        edit={handleClickPenIcon}
      />
      <Setting
        name="최대 연속 근무"
        step="연속근무"
        value={`${ward.maxContinuousWork}일`}
        edit={handleClickPenIcon}
      />
      <Setting
        name="최대 연속 나이트"
        step="연속근무"
        value={`${ward.maxContinuousNight}일`}
        edit={handleClickPenIcon}
      />
      <Setting
        name="최소 나이트 간격"
        step="연속근무"
        value={`${ward.minNightInterval}일`}
        edit={handleClickPenIcon}
      />
      <ShiftTypeSetting
        shiftTypeList={ward.shiftTypes}
        addShiftType={addShiftType}
        editShiftType={editShiftType}
        removeShiftType={removeShiftType}
      />
    </div>
  );
};

export default SetShiftPage;
