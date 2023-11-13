import { match } from 'ts-pattern';
import MakeTutorial from './MakeTutorial';
import MemberTutorial from './MemberTutorial';
import RequestTutorial from './RequestTutorial';
import ROUTE from '@libs/constant/path';
import { useLocation } from 'react-router';

const Tutorial = () => {
  const { pathname } = useLocation();

  return match(pathname)
    .with(ROUTE.MAKE, () => <MakeTutorial />)
    .with(ROUTE.REQUEST, () => <RequestTutorial />)
    .with(ROUTE.MEMBER, () => <MemberTutorial />)
    .otherwise(() => null);
};

export default Tutorial;
