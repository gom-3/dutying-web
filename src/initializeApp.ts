import * as Sentry from '@sentry/react';
import ReactGA from 'react-ga4';
import { createBrowserHistory } from 'history';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router';
import ReactPixel from 'react-facebook-pixel';
import { useEffect } from 'react';

export default async function initializeApp() {
  // GA 관련 초기화
  ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID, { gaOptions: {} });
  // Pixel 관련 초기화
  ReactPixel.init(import.meta.env.VITE_PIXEL_ID);
  // const advancedMatching = { em: 'some@email.com' }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
  // const options = {
  //   autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
  //   debug: false, // enable logs
  // };

  const history = createBrowserHistory();
  history.listen((response) => {
    ReactGA.send({ hitType: 'pageview', page: response.location.pathname });
    ReactPixel.pageView();
    ReactPixel.fbq('track', 'PageView');
  });

  // Sentry 관련 초기화
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', /^http:\/\/54\.180\.65\.130:8080/],
        // See docs for support of different versions of variation of react router
        // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}
