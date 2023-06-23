import 'index.css';
import { useShiftKind } from 'stores/shiftStore';

interface Props {
  id: number;
  isCurrent: boolean;
}

const ShiftCircle = ({ id, isCurrent }: Props) => {
  const shiftKind = useShiftKind();
  console.log(isCurrent);

  return (
    <div
      className={`absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] ${shiftKind[id].color} flex h-[30px] w-[30px] items-center justify-center rounded-full font-poppins text-[15px] text-white`}
    >
      {shiftKind[id].name}
    </div>
  );
};

export default ShiftCircle;
