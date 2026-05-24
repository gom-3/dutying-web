import useAuth from '@/features/auth';
import {useMakeShiftBootstrap} from './model/use-bootstrap';
import {MakeShiftPageView} from './ui';
import MakeTutorial from './ui/make-tutorial';

const MakeShiftPage = () => {
    const {
        state: {wardId},
    } = useAuth();

    useMakeShiftBootstrap(wardId);

    return (
        <>
            <MakeShiftPageView />
            <MakeTutorial />
        </>
    );
};

export default MakeShiftPage;
