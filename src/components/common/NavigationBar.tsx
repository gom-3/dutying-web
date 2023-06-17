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
    <div className="absolute left-0 flex h-screen w-52 flex-col items-center justify-evenly bg-white">
      <div onClick={() => navigate('/members/regist')}>간호사 관리</div>
      <div>근무 설정</div>
      <div>휴가 신청 관리</div>
      <div onClick={() => navigate('/duty/make')}>근무표 제작</div>
      <div>설정</div>
    </div>
  );
};

export default NavigationBar;
