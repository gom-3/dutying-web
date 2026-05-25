import {Navigate, useLocation} from 'react-router';
import ROUTE from '@/shared/constant/path';

const DutyPage = () => {
    const location = useLocation();

    return <Navigate to={`${ROUTE.MAKE}${location.search}`} replace />;
};

export default DutyPage;
