import { SetShift } from '@components/Settings';
import 'index.css';
import { useShiftStore } from 'stores/shiftStore';
import { shallow } from 'zustand/shallow';

const ShiftTypeSetting = () => {
  const { shiftList, setShiftList } = useShiftStore(
    (state) => ({ shiftList: state.shiftList, setShiftList: state.setShiftList }),
    shallow
  );

  let shiftListInitial = '';
  shiftList.forEach((shift) => (shiftListInitial += ` ${shift.shortName}`));
  return (
    <div className="mb-[1.5625rem] rounded-[1.25rem] bg-white px-[1.25rem] py-[1.875rem] shadow-shadow-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="ml-[1rem] h-[.625rem] w-[.625rem] rounded-full bg-sub-3" />
          <div className="ml-[1.875rem] font-apple text-[1.875rem] text-sub-2">근무 형태</div>
        </div>
        <div className="flex items-center">
          <div className="mr-[1.875rem] font-poppins text-[2rem] text-main-1">
            {shiftListInitial}
          </div>
        </div>
      </div>
      <div>
        <SetShift.Contents shiftList={shiftList} setShiftList={setShiftList} />
      </div>
    </div>
  );
};

export default ShiftTypeSetting;
