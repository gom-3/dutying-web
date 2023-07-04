import 'index.css';
import { useShiftList } from 'stores/shiftStore';

interface Props {
  id: number;
  translucent?: boolean;
}

/** 근무 유형에 해당하는 동그라미 모양의 컴포넌트
 * @param id 근무 유형 id
 * @param translucent 반투명 여부. 기본값 - false
 * @example true-반투명 false-일반
 */
const ShiftCircle = ({ id, translucent }: Props) => {
  const shiftKind = useShiftList();
  return shiftKind[id] ? (
    <div
      className={`${
        translucent && 'opacity-30'
      } absolute left-1/2 top-1/2 flex h-[1.675rem] w-[1.675rem] translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-full font-poppins text-[.9375rem] text-white`}
      style={{ backgroundColor: shiftKind[id].color }}
    >
      {shiftKind[id].shortName}
    </div>
  ) : null;
};

export default ShiftCircle;
