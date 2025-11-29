import {isMobile} from 'is-mobile';
import MobileLanding from './components/MobileLanding';
import WebLanding from './components/WebLanding';

function LandingPage() {
    const mobile = isMobile();

    return mobile ? <MobileLanding /> : <WebLanding />;
}

export default LandingPage;
