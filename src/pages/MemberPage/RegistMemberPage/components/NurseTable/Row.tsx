import CheckBox from '@components/CheckBox';
import ConnectState from '@components/ConnectState';
import useEditNurse from '@hooks/useEditNurse';
import 'index.css';

type Props = {
  nurse: Nurse;
  isFirst: boolean;
  isSelected: boolean;
  rowspan?: number;
};

const Row = ({ nurse, isFirst, isSelected, rowspan }: Props) => {
  const {
    actions: { selectNurse, updateNurseShift },
  } = useEditNurse();

  const handleNameClick = () => {
    selectNurse(nurse.nurseId);
  };

  const handleBoxClick = (i: number) => {
    updateNurseShift(nurse.nurseId, nurse.nurseShiftTypes[i].nurseShiftTypeId, {
      isPossible: !nurse.nurseShiftTypes[i].isPossible,
    });
  };

  return (
    <tr>
      {isFirst && (
        <td
          rowSpan={rowspan}
          className="h-[3.5rem] w-[8.75rem] border border-b-0 border-l-0 border-sub-4 text-[1.25rem] font-normal"
        >
          {nurse.level}
        </td>
      )}
      <td
        onClick={handleNameClick}
        className={`${
          isSelected ? 'border-1 border-main-2 bg-main-2/10' : ''
        } h-14 w-[11.625rem] cursor-pointer border border-b-0 border-sub-4 font-apple text-[1.25rem] font-normal text-sub-1`}
      >
        {nurse.name}
      </td>
      <td
        onClick={() => handleBoxClick(0)}
        className="h-14 w-[10.1875rem] cursor-pointer border border-b-0 border-sub-4 text-[1.25rem] font-normal"
      >
        <CheckBox
          isChecked={nurse.nurseShiftTypes[0].isPossible}
          checkedText="가능"
          uncheckedText="불가능"
        />
      </td>
      <td
        onClick={() => handleBoxClick(1)}
        className="h-14 w-[10.1875rem] cursor-pointer border border-b-0 border-sub-4 text-[1.25rem] font-normal"
      >
        <CheckBox
          isChecked={nurse.nurseShiftTypes[1].isPossible}
          checkedText="가능"
          uncheckedText="불가능"
        />
      </td>
      <td
        onClick={() => handleBoxClick(2)}
        className="h-14 w-[10.1875rem] cursor-pointer border border-b-0 border-sub-4 text-[1.25rem] font-normal"
      >
        <CheckBox
          isChecked={nurse.nurseShiftTypes[2].isPossible}
          checkedText="가능"
          uncheckedText="불가능"
        />
      </td>
      <td className="h-14 w-[10.1875rem] border border-b-0 border-sub-4 text-[1.25rem] font-normal">
        <CheckBox isChecked checkedText="가능" uncheckedText="불가능" />
      </td>
      <td className="h-14 w-[10.8rem] border border-b-0 border-r-0 border-sub-4 text-[1.25rem] font-normal">
        <ConnectState isConnected={false} textVisible />
      </td>
    </tr>
  );
};

export default Row;
