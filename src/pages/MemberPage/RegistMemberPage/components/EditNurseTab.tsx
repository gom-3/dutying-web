import { ChangeEvent, useState } from 'react';
import 'index.css';

type Props = {
  isEdit?: boolean;
  isAdd?: boolean;
  nurse?: Nurse;
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
}: Props) => {
  const [form, setForm] = useState(nurse);
  console.log(isEdit, isAdd, setForm);
  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div>
      <input type="text" onChange={inputHandler} value={form.name} id="name" placeholder="이름" />
      <input
        type="tel"
        onChange={inputHandler}
        value={form.phone}
        id="phone"
        placeholder="전화번호"
      />
      <input
        type="number"
        onChange={inputHandler}
        value={form.proficiency}
        id="proficiency"
        placeholder="숙련도"
      />
    </div>
  );
};

export default EditNurseTab;
