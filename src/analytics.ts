import ReactGA from 'react-ga4';
import ReactPixel from 'react-facebook-pixel';
import { logEvent } from 'firebase/analytics';
import { analytics, hackleClient } from 'initializeApp';

interface Event {
  category: string;
  action: string;
}

export const event = {
  clickNavigationItem: {
    category: 'click',
    action: 'click_navigation_item',
  },
  clickFoldButton: {
    category: 'click',
    action: 'click_fold_button',
  },
};

export const sendEvent = (event: Event, label?: string) => {
  ReactGA.event({
    category: event.category,
    action: event.action,
    label,
  });
  ReactPixel.trackCustom(event.action, { label });
  hackleClient.track({ key: event.action, properties: { label } });
  logEvent(analytics, event.action, { label });
};
