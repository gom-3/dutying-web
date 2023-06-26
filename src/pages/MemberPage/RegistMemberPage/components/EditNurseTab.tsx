import { ChangeEvent } from 'react';
import 'index.css';
import useEditNurseTab, { CheckState } from './useEditNurseTab';

type Props = {
  isEdit?: boolean;
  isAdd?: boolean;
  nurse?: Nurse;
  closeTab: () => void;
  updateNurse: (id: number, updatedNurse: Nurse) => void;
  addNurse: (newNurse: Nurse) => void;
};

const defaultProps = {
  isEdit: false,
  isAdd: false,
  nurse: {
    id: 0,
    name: '',
    phone: '',
    proficiency: 1, // 숙련도
    isConnected: false, // 연동
    workAvailable: [],
    workPrefer: [],
    workRequest: [], // 신청 오프
    trait: [],
    accWeekendOff: 0,
  },
};

const EditNurseTab = ({
  isEdit = defaultProps.isEdit,
  isAdd = defaultProps.isAdd,
  nurse = defaultProps.nurse,
  closeTab,
  updateNurse,
  addNurse,
}: Props) => {
  const { formState, shiftList, ref, handlers } = useEditNurseTab(
    nurse,
    closeTab,
    isAdd,
    isEdit,
    updateNurse,
    addNurse
  );

  const { form, availChecked, preferChecked } = formState;

  const {
    handleInputChange,
    handleAvailCheckboxChange,
    handlePreferCheckboxChange,
    handleSaveButton,
  } = handlers;

  const makeShiftCheckBoxes = (
    checkState: CheckState,
    change: (e: ChangeEvent<HTMLInputElement>) => void
  ) => {
    const checkBoxes = shiftList.map((_, index) => {
      return (
        <input
          type="checkbox"
          checked={checkState[index] || false}
          id={`${index}`}
          onChange={change}
        />
      );
    });
    return checkBoxes;
  };

  const availShiftCheckBoxes = makeShiftCheckBoxes(availChecked, handleAvailCheckboxChange);
  const preferShiftCheckBoxes = makeShiftCheckBoxes(preferChecked, handlePreferCheckboxChange);

  return (
    <div ref={ref} className="h-[737px] w-[448px] rounded-[20px] bg-white shadow-shadow-1">
      <label htmlFor="name">이름</label>
      <input
        type="text"
        onChange={handleInputChange}
        value={form.name}
        id="name"
        placeholder="이름"
      />
      <label htmlFor="phone">전화번호</label>
      <input
        type="tel"
        onChange={handleInputChange}
        value={form.phone}
        id="phone"
        placeholder="전화번호"
      />
      <label htmlFor="proficiency">숙련도</label>
      <input
        type="number"
        max={4}
        min={1}
        onChange={handleInputChange}
        value={form.proficiency}
        id="proficiency"
        placeholder="숙련도"
      />
      {availShiftCheckBoxes}
      {preferShiftCheckBoxes}
      <button type="button" onClick={handleSaveButton}>
        저장
      </button>
      <div onClick={closeTab}>닫기</div>
    </div>
  );
};

export default EditNurseTab;
