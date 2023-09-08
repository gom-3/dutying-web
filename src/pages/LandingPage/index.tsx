import { FullLogo, LogoSymbolFill } from '@assets/svg';
import ROUTE from '@libs/constant/path';
import { Link } from 'react-router-dom';
import Button from '@components/Button';

function LandingPage() {
  return (
    <div className="w-screen">
      <div className="flex w-full justify-between px-2">
        <div className="flex">
          <LogoSymbolFill className="h-[1.875rem] w-[1.875rem]" />
          <FullLogo className="h-[1.875rem] w-[6.875rem]" />
        </div>
        <Button className="text-md rounded-lg px-2">
          <Link to={ROUTE.HOME}>근무표 짜러가기</Link>
        </Button>
      </div>
    </div>
  );
}

export default LandingPage;
