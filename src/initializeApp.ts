import airbridge from 'airbridge-web-sdk-loader';
import { createBrowserHistory } from 'history';
import { enableMapSet } from 'immer';
import ReactPixel from 'react-facebook-pixel';
import ReactGA from 'react-ga4';

export default function initializeApp() {
  enableMapSet();

  if (import.meta.env.PROD) {
    // GA 관련 초기화
    ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID, { gaOptions: {} });

    const history = createBrowserHistory();

    history.listen(async (response) => {
      ReactGA.send({ hitType: 'pageview', page: response.location.pathname });
    });

    // Pixel 관련 초기화
    ReactPixel.init(import.meta.env.VITE_PIXEL_ID);
    ReactPixel.pageView();

    // Airbridge 관련 초기화
    airbridge.init({
      app: import.meta.env.VITE_AIRBRIDGE_NAME,
      webToken: import.meta.env.VITE_AIRBRIDGE_WEB_TOKEN,
    });
  }
}
