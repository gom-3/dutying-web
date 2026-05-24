import {FullLogo, LogoSymbolFill} from '@/shared/assets/svg';
import ROUTE from '@/shared/constant/path';

function HeaderLogo() {
    return (
        <a href={ROUTE.ROOT} className="fixed top-7.5 left-12.5 flex items-center gap-4">
            <LogoSymbolFill className="h-8 w-8" />
            <FullLogo className="h-7.5 w-27.5" />
        </a>
    );
}

export default HeaderLogo;
