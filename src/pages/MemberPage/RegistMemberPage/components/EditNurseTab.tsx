import { ChangeEvent, useEffect, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import 'index.css';
import { useShiftKind } from 'stores/shiftStore';

type Props = {
  isEdit?: boolean;
  isAdd?: boolean;
  nurse?: Nurse;
  closeTab: () => void;
};

type CheckState = {
  [key: string]: boolean;
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
}: Props) => {
  const [form, setForm] = useState(nurse);
  const [availChecked, setAvailChecked] = useState<CheckState>({});
  const [preferChecked, setPreferChecked] = useState<CheckState>({});
  const ref = useOnclickOutside(() => closeTab());

  console.log(isEdit, isAdd);

  const shiftKind = useShiftKind();

  useEffect(() => {
    let temp = {};
    shiftKind.forEach((shift) => {
      temp = { ...temp, [shift.id]: false };
    });
    setAvailChecked(temp);
    setPreferChecked(temp);
  }, [shiftKind]);

  const handleAvailCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;

    setAvailChecked((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handlePreferCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;

    setPreferChecked((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const makeShiftCheckBoxes = (
    checkState: CheckState,
    change: (e: ChangeEvent<HTMLInputElement>) => void
  ) => {
    const checkBoxes = shiftKind.map((shift) => {
      return (
        <input
          type="checkbox"
          checked={checkState[shift.id] || false}
          id={`${shift.id}`}
          onChange={change}
        />
      );
    });
    return checkBoxes;
  };

  const availShiftCheckBoxes = makeShiftCheckBoxes(availChecked, handleAvailCheckboxChange);
  const preferShiftCheckBoxes = makeShiftCheckBoxes(preferChecked, handlePreferCheckboxChange);

  return (
    <div ref={ref} className="absolute right-0 h-screen w-96 bg-white shadow-md">
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
        onChange={handleInputChange}
        value={form.proficiency}
        id="proficiency"
        placeholder="숙련도"
      />
      {availShiftCheckBoxes}
      {preferShiftCheckBoxes}
      <div onClick={closeTab}>닫기</div>
    </div>
  );
};

export default EditNurseTab;
