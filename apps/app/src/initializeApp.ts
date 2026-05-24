import * as Sentry from '@sentry/react';
import {createBrowserHistory} from 'history';
import {enableMapSet} from 'immer';
import ReactPixel from 'react-facebook-pixel';
import ReactGA from 'react-ga4';

export default function initializeApp() {
    enableMapSet();

    if (import.meta.env.PROD) {
        const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID;
        const pixelId = import.meta.env.VITE_PIXEL_ID;

        Sentry.init({
            dsn: 'https://5035f79c451043f4b6438a90817ff608@o4505477969084416.ingest.us.sentry.io/4505477970526208',
            tracesSampleRate: 0.2,
            attachStacktrace: true,
            environment: 'production',
        });

        // GA 관련 초기화
        if (gaTrackingId) {
            ReactGA.initialize(gaTrackingId, {gaOptions: {}});
        }

        if (gaTrackingId) {
            const history = createBrowserHistory();

            history.listen(async (response) => {
                ReactGA.send({hitType: 'pageview', page: response.location.pathname});
            });
        }

        // Pixel 관련 초기화
        if (pixelId) {
            ReactPixel.init(pixelId);
            ReactPixel.pageView();
        }
    }
}
