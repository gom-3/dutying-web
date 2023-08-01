import ReactGA from 'react-ga4';
import ReactPixel from 'react-facebook-pixel';
import { logEvent } from 'firebase/analytics';
import { analytics, hackleClient } from 'initializeApp';

interface Event {
  category: string;
  action: string;
}

export const event = {
  clickFoldLevelButton: {
    category: 'click',
    action: 'click_fold_level_button',
  },
  clickHistoryTab: {
    category: 'click',
    action: 'click_history_tab',
  },
  clickFaultTab: {
    category: 'click',
    action: 'click_fault_tab',
  },
  clickExcelDownloadButton: {
    category: 'click',
    action: 'click_excel_download_button',
  },
  clickFoldNavigationButton: {
    category: 'click',
    action: 'click_fold_navigation_button',
  },
  changeShift: {
    category: 'make',
    action: 'change_shift',
  },
  login: {
    category: 'access',
    action: 'login',
  },
};

export const sendEvent = (event: Event, label?: string) => {
  if (import.meta.env.PROD) {
    ReactGA.event({
      category: event.category,
      action: event.action,
      label,
    });
    ReactPixel.trackCustom(event.action, { label });
    hackleClient.track({ key: event.action, properties: { label } });
    analytics && logEvent(analytics, event.action, { label });
  }
};
