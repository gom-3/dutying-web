import 'index.css';
import { useShiftList } from 'stores/shiftStore';

interface Props {
  id: number;
  isCurrent: boolean;
}

const ShiftCircle = ({ id }: Props) => {
  const shiftKind = useShiftList();
  return shiftKind[id] ? (
    <div
      className={`absolute left-1/2 top-1/2 flex h-[1.875rem] w-[1.875rem] translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-full font-poppins text-[.9375rem] text-white`}
      style={{ backgroundColor: shiftKind[id].color }}
    >
      {shiftKind[id].shortName}
    </div>
  ) : null;
};

export default ShiftCircle;
