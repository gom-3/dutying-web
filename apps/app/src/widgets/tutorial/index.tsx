import {useLocation} from 'react-router';
import ROUTE from '@/shared/constant/path';
import MemberTutorial from './MemberTutorial';
import RequestTutorial from './RequestTutorial';

const TUTORIAL_BY_ROUTE = {
    [ROUTE.REQUEST]: RequestTutorial,
    [ROUTE.MEMBER]: MemberTutorial,
} as const;
const Tutorial = () => {
    const {pathname} = useLocation();
    const TutorialComponent = TUTORIAL_BY_ROUTE[pathname as keyof typeof TUTORIAL_BY_ROUTE];

    return TutorialComponent ? <TutorialComponent /> : null;
};

export default Tutorial;
