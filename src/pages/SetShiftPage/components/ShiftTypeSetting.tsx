import useEditWard from '@hooks/useEditWard';
import SetShift from './SetShift';

const ShiftTypeSetting = () => {
  const {
    state: { ward },
  } = useEditWard();

  return (
    <div className="mb-[1.5625rem] rounded-[1.25rem] bg-white px-[1.25rem] py-[1.875rem] shadow-shadow-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="ml-[1rem] h-[.625rem] w-[.625rem] rounded-full bg-sub-3" />
          <div className="ml-[1.875rem] font-apple text-[1.875rem] text-sub-2">근무 형태</div>
        </div>
        <div className="flex items-center">
          <div className="mr-[1.875rem] font-poppins text-[2rem] text-main-1">
            {ward?.shiftTypes.map((x) => x.shortName).join(' ')}
          </div>
        </div>
      </div>
      <div>
        <SetShift />
      </div>
    </div>
  );
};

export default ShiftTypeSetting;
