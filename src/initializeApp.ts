import * as Sentry from '@sentry/react';
import ReactGA from 'react-ga4';
import { createBrowserHistory } from 'history';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router';
import { useEffect } from 'react';
import { initializeApp as initializeFirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { createInstance } from '@hackler/react-sdk';
import { enableMapSet } from 'immer';
import airbridge from 'airbridge-web-sdk-loader';

enableMapSet();

airbridge.init({
  app: 'App Name',
  webToken: 'Web SDK Token',
});

// Firebase 관련 초기화
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = import.meta.env.PROD ? initializeFirebaseApp(firebaseConfig) : null;
export const analytics = app ? getAnalytics(app) : null;

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

  // Hackle 관련 초기화

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

export const hackleClient = createInstance(import.meta.env.VITE_HACKLE_SDK_KEY);
