import 'index.css';
import { useShiftList } from 'stores/shiftStore';

interface Props {
  id: number;
  isCurrent: boolean;
}

const ShiftCircle = ({ id, isCurrent }: Props) => {
  const shiftKind = useShiftList();
  console.log(isCurrent);

  return (
    <div
      className={`absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] ${shiftKind[id].color} flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded-full font-poppins text-[.9375rem] text-white`}
    >
      {shiftKind[id].name}
    </div>
  );
};

export default ShiftCircle;
