import 'index.css';
import Setting from './components/Setting';
import { useShiftStore } from 'stores/shiftStore';

const DutySetupPage = () => {
  const { actions, maxContinuosNight, maxContinuosShift, minNightInterval, shiftList } =
    useShiftStore();
  console.log(maxContinuosNight);
  return (
    <div className="w-[100vw] p-[3.4375rem]">
      <div className="font-apple text-[2.25rem] text-text-1 mb-[3.625rem]">xx병동 근무 설정</div>
      <Setting name="최대 연속 근무" value="5일" />
      <Setting name="최대 연속 나이트" value="3일" />
      <Setting name="최소 나이트 간격" value="10일" />
      <Setting name="근무 유형" value="5일" />
    </div>
  );
};

export default DutySetupPage;
