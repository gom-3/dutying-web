import React from 'react';
import 'index.css';

type Props = {
  isEdit?: boolean;
  isAdd?: boolean;
  nurse?: Nurse;
};

const defaultProps: Props = {
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

const EditNurseTab: React.FC<Props> = ({
  isEdit = defaultProps.isEdit,
  isAdd = defaultProps.isAdd,
  nurse = defaultProps.nurse,
}) => {
  console.log(nurse, isEdit, isAdd);
  return (
    <div>
      <div>123</div>
    </div>
  );
};

export default EditNurseTab;
