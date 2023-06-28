import 'index.css';
import NurseCard from './NurseCard';
import { useState } from 'react';

interface Props {
  nurses: Nurse[];
  edit: (nurse: Nurse) => void;
  add: () => void;
  updateNurse: (id: number, updatedNurse: Nurse) => void;
}

const NurseTable = ({ edit, add, nurses, updateNurse }: Props) => {
  const [selectedNurse, setSelectedNurse] = useState(nurses[0].id);

  const selectNurse = (id: number) => {
    setSelectedNurse(id);
  };

  const proficiencyFilter = (p: number) => {
    const temp = nurses.filter((nurse) => nurse.proficiency === p);
    return temp.map((nurse, i) => (
      <NurseCard
        updateNurse={updateNurse}
        edit={edit}
        add={add}
        isSelected={nurse.id === selectedNurse}
        isFirst={i === 0}
        rowspan={temp.length}
        nurse={nurse}
        selectNurse={selectNurse}
      />
    ));
  };

  const group1 = proficiencyFilter(3);
  const group2 = proficiencyFilter(2);
  const group3 = proficiencyFilter(1);

  return (
    <div className="mt-[2.875rem]">
      <table className="border-collapse rounded-[1.25rem] border-hidden text-center shadow-shadow-1">
        <thead className="block h-[3.5rem] w-[72.6875rem] rounded-[20px]">
          <tr className="rounded-[20px] bg-sub-5 font-apple font-normal text-sub-2.5">
            <th className="h-[3.5rem] w-[8.75rem] items-center justify-center rounded-tl-[1.25rem] text-[1.25rem] font-normal">
              숙련도
            </th>
            <th className="h-[3.5rem] w-[11.625rem] items-center justify-center text-[1.25rem] font-normal">
              이름
            </th>
            <th className="h-[3.5rem] w-[10.1875rem] items-center justify-center text-[1.25rem] font-normal">
              데이
            </th>
            <th className="h-[3.5rem] w-[10.1875rem] items-center justify-center text-[1.25rem] font-normal">
              이브닝
            </th>
            <th className="h-[3.5rem] w-[10.1875rem] items-center justify-center text-[1.25rem] font-normal">
              나이트
            </th>
            <th className="h-[3.5rem] w-[10.1875rem] items-center justify-center text-[1.25rem] font-normal">
              평일만 근무
            </th>
            <th className="h-[3.5rem] w-[12.1875rem] items-center justify-center rounded-tr-[1.25rem] text-[1.25rem] font-normal">
              근무자 연동
            </th>
          </tr>
        </thead>
        <tbody
          style={{ maxHeight: 'calc(100vh - 23rem' }}
          className="scroll block w-[72.6875rem] border-collapse overflow-x-hidden overflow-y-scroll rounded-b-[20px]"
        >
          {group1}
          {group2}
          {group3}
        </tbody>
      </table>
    </div>
  );
};

export default NurseTable;
