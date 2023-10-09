import 'index.css';

interface Props {
  wardShiftType: WardShiftType | null;
  translucent?: boolean;
}

/** 근무 유형에 해당하는 동그라미 모양의 컴포넌트
 * @param id 근무 유형 id
 * @param translucent 반투명 여부. 기본값 - false
 * @example true-반투명 false-일반
 */
const ShiftCircle = ({ wardShiftType, translucent }: Props) => {
  return wardShiftType !== null ? (
    <div
      className={`${
        translucent && 'opacity-30'
      } absolute left-1/2 top-1/2 flex h-[1.675rem] w-[1.675rem] translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-full font-poppins text-[.9375rem] text-white`}
      style={{ backgroundColor: wardShiftType.backgroundColor }}
    >
      {wardShiftType.shortName}
    </div>
  ) : null;
};

export default ShiftCircle;
