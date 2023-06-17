import { DutyIcon, FullLogo, NurseIcon, RequestIcon, SettingIcon } from '@assets/svg';
import 'index.css';
import { useNavigate } from 'react-router';

const NavigationBar = () => {
  const navigate = useNavigate();

  /** 경로들은 나중에 상수 값으로 관리할 것
   * @example
   * const MEMBER_PATH  = {
   *  REGIST: '/members/regist',
   * }
   */
  return (
    <div className="absolute left-0 flex h-screen w-[162px] flex-col items-center justify-evenly bg-white border-r border-sub-4">
      <FullLogo />
      <div>
        <NurseIcon />
        <div onClick={() => navigate('/members/regist')}>간호사 관리FdN</div>
      </div>
      <div>
        <NurseIcon />
        <div>근무 설정</div>
      </div>
      <div>
        <RequestIcon />
        <div>휴가 신청 관리</div>
      </div>
      <div onClick={() => navigate('/duty/make')}>
        <DutyIcon />
        <div>근무표 제작</div>
      </div>
      <div>
        <SettingIcon />
        <div>설정</div>
      </div>
    </div>
  );
};

export default NavigationBar;
