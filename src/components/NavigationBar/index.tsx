import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router';
import {FoldIcon, HelpIcon} from '@/assets/svg';
import useAuth from '@/hooks/auth/useAuth';
import useTutorial from '@/hooks/ui/useTutorial';
import ROUTE from '@/libs/constant/path';
import {events, sendEvent} from 'analytics';
import NavigationBarItemGroups from './NavigationBarItemGroup';

interface Props {
    isFold: boolean;
    setIsFold: (isFold: boolean) => void;
}

const NavigationBar = ({isFold, setIsFold}: Props) => {
    const {
        state: {accountMe},
    } = useAuth();
    const [canHover, setCanHover] = useState(true);
    const {
        actions: {setMakeTutorial, setMemberTutorial, setRequestTutorial},
    } = useTutorial();
    const navigate = useNavigate();
    const handleResetTutorial = () => {
        switch (window.location.pathname) {
            case ROUTE.MAKE:
                setMakeTutorial(true);
                break;
            case ROUTE.MEMBER:
                setMemberTutorial(true);
                break;
            case ROUTE.REQUEST:
                setRequestTutorial(true);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCanHover(false);
        setTimeout(() => {
            setCanHover(true);
        }, 500);
    }, [isFold]);

    return (
        <div className="group fixed left-0 z-997">
            <div
                data-testid="navigation-bar"
                className={`z-10 ${canHover && 'group-hover:translate-x-0'} ${!isFold ? 'sticky' : 'fixed'} top-0 duration-500 ease-out ${
                    !isFold ? '' : '-translate-x-32'
                } left-0 flex h-screen w-40.5 flex-col items-center border-r border-sub-4 bg-white font-apple text-base text-sub-3`}
            >
                <div
                    onClick={() => {
                        setIsFold(!isFold);
                        sendEvent(isFold ? events.navigationBar.spreadNavigation : events.navigationBar.foldNavigation);
                    }}
                >
                    <FoldIcon
                        className={`${
                            isFold && 'left-[.9375rem] scale-x-[-1]'
                        } absolute top-[.8125rem] right-[.875rem] h-7.5 w-7.5 cursor-pointer duration-300`}
                    />
                </div>
                <NavigationBarItemGroups />
                <div className="mt-auto mb-12.5 flex flex-col items-center gap-8 pt-8">
                    <div className="flex cursor-pointer flex-col items-center" onClick={handleResetTutorial}>
                        <HelpIcon className="h-12.5 w-12.5 rounded-full" />
                        <div className="mt-2 text-[1rem] text-sub-3">가이드</div>
                    </div>
                    <div className="flex cursor-pointer flex-col items-center" onClick={() => navigate(ROUTE.PROFILE)}>
                        <img
                            src={accountMe?.profileImgBase64 ? 'data:image/png;base64,' + accountMe?.profileImgBase64 : ''}
                            alt=""
                            className="h-12.5 w-12.5 rounded-full"
                        />
                        <div className="mt-2 text-[1rem] text-sub-3">{accountMe?.name}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;
