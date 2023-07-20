import 'index.css';
import Row from './Row';
import { useEffect, useRef, useState } from 'react';
import { updateNurseShiftTypeRequest } from '@libs/api/nurse';

interface Props {
  nurses: Nurse[];
  nurse: Nurse;
  edit: (nurse: Nurse) => void;
  addNurse: () => void;
  deleteNurse: (id: number) => void;
  updateNurseShift: (
    nurseId: number,
    nurseShiftTypeId: number,
    change: updateNurseShiftTypeRequest
  ) => void;
}

const NurseTable = ({ nurse, edit, addNurse, deleteNurse, nurses, updateNurseShift }: Props) => {
  const [selectedNurse, setSelectedNurse] = useState(nurse.nurseId);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const ref = useRef<HTMLTableSectionElement>(null);

  const handleOnClickAddNurse = () => {
    addNurse();
    setShouldScrollToBottom(true);
  };

  const handleOnClickDeleteNurse = () => {
    deleteNurse(nurse.nurseId);
  };

  useEffect(() => {
    if (shouldScrollToBottom && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setShouldScrollToBottom(false);
    }
  }, [nurses, shouldScrollToBottom]);

  const selectNurse = (id: number) => {
    setSelectedNurse(id);
  };

  useEffect(() => {
    setSelectedNurse(nurse.nurseId);
  }, [nurse]);

  const levelFilter = (p: number) => {
    const temp = nurses.filter((nurse) => nurse.level === p);
    return temp.map((nurse, i) => (
      <Row
        updateNurseShift={updateNurseShift}
        edit={edit}
        add={addNurse}
        isSelected={nurse.nurseId === selectedNurse}
        isFirst={i === 0}
        rowspan={temp.length}
        nurse={nurse}
        selectNurse={selectNurse}
      />
    ));
  };

  const group1 = levelFilter(3);
  const group2 = levelFilter(2);
  const group3 = levelFilter(1);

  return (
    <div className="mt-[1.875rem]">
      <div className="mb-[.9375rem] flex w-full justify-between font-apple text-sub-3">
        <div>간호사 전체 명단</div>
        <div className="flex">
          <div
            onClick={handleOnClickAddNurse}
            className="mr-[.625rem] flex w-[3.25rem] cursor-pointer items-center justify-center rounded-[2rem] border border-main-2 bg-white font-apple text-main-2"
          >
            추가
          </div>
          <div
            onClick={handleOnClickDeleteNurse}
            className="mr-[.5rem] flex w-[3.25rem] cursor-pointer items-center justify-center rounded-[2rem] border border-main-2 bg-white font-apple text-main-2"
          >
            삭제
          </div>
        </div>
      </div>
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
              주말 근무
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
          <div ref={ref} />
        </tbody>
      </table>
    </div>
  );
};

export default NurseTable;
