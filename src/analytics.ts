import ReactGA from 'react-ga4';
import ReactPixel from 'react-facebook-pixel';
import { createInstance } from '@hackler/react-sdk';

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
  const hackleClient = createInstance(import.meta.env.VITE_HACKLE_SDK_KEY);

  ReactGA.event({
    category: event.category,
    action: event.action,
    label,
  });
  ReactPixel.trackCustom(event.action, { label });
  hackleClient.track({ key: event.action, properties: { label } });
};
