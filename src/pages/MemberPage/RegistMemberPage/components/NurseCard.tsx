import AvailCheckBox from '@components/AvailCheckBox';
import LinkState from '@components/LinkState';
import 'index.css';
import { useState } from 'react';

type Props = {
  nurse: Nurse;
  updateNurse: (id: number, updatedNurse: Nurse) => void;
  edit: (nurse: Nurse) => void;
  add: () => void;
  selectNurse: (id: number) => void;
  isFirst: boolean;
  isSelected: boolean;
  rowspan?: number;
};

const NurseCard = ({
  nurse,
  selectNurse,
  updateNurse,
  edit,
  // add,
  isFirst,
  isSelected,
  rowspan,
}: Props) => {
  const [isChecked, setIsChecked] = useState(nurse.shiftOption);

  const handleNameClick = () => {
    selectNurse(nurse.id);
    edit(nurse);
  };

  const handleBoxClick = (i: number) => {
    const temp = [...isChecked];
    temp[i].avail = !temp[i].avail;
    const updatedNurse: Nurse = {
      ...nurse,
      shiftOption: temp,
    };
    updateNurse(nurse.id, updatedNurse);
    setIsChecked(temp);
  };

  return (
    <tr>
      {isFirst && (
        <td
          rowSpan={rowspan}
          className="h-[3.5rem] w-[8.75rem] border border-b-0 border-l-0 border-sub-4 text-[1.25rem] font-normal"
        >
          {nurse.proficiency}
        </td>
      )}
      <td
        onClick={handleNameClick}
        className={`${
          isSelected ? 'border-2 border-b-2 border-main-2 bg-main-2/10' : ''
        } h-14 w-[11.625rem] cursor-pointer border border-b-0 border-sub-4 font-apple text-[1.25rem] font-normal text-sub-1`}
      >
        {nurse.name}
      </td>
      <td
        onClick={() => handleBoxClick(0)}
        className="h-14 w-[10.1875rem] cursor-pointer border border-b-0 border-sub-4 text-[1.25rem] font-normal"
      >
        <AvailCheckBox isChecked={isChecked[0].avail} />
      </td>
      <td
        onClick={() => handleBoxClick(1)}
        className="h-14 w-[10.1875rem] cursor-pointer border border-b-0 border-sub-4 text-[1.25rem] font-normal"
      >
        <AvailCheckBox isChecked={isChecked[1].avail} />
      </td>
      <td
        onClick={() => handleBoxClick(2)}
        className="h-14 w-[10.1875rem] cursor-pointer border border-b-0 border-sub-4 text-[1.25rem] font-normal"
      >
        <AvailCheckBox isChecked={isChecked[2].avail} />
      </td>
      <td className="h-14 w-[10.1875rem] border border-b-0 border-sub-4 text-[1.25rem] font-normal">
        <AvailCheckBox isChecked />
      </td>
      <td className="h-14 w-[10.8rem] border border-b-0 border-r-0 border-sub-4 text-[1.25rem] font-normal">
        <LinkState isLinked={false} />
      </td>
    </tr>
  );
};

export default NurseCard;
