import ReactGA from 'react-ga4';
import { createBrowserHistory } from 'history';
import { enableMapSet } from 'immer';
import airbridge from 'airbridge-web-sdk-loader';

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
    import('react-facebook-pixel')
      .then((module) => module.default)
      .then((ReactPixel) => {
        ReactPixel.init(import.meta.env.VITE_PIXEL_ID);
        ReactPixel.pageView();
      });

    // Airbridge 관련 초기화
    airbridge.init({
      app: import.meta.env.VITE_AIRBRIDGE_NAME,
      webToken: import.meta.env.VITE_AIRBRIDGE_WEB_TOKEN,
    });
  }
}
