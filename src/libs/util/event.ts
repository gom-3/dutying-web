import ReactGA from 'react-ga4';
import type {UaEventOptions} from 'react-ga4/types/ga4';
/* eslint-disable @typescript-eslint/no-explicit-any */

const EVENTS: Record<string, Record<string, UaEventOptions>> = {
    LOGIN_PAGE: {
        LOGIN: {
            action: 'login',
            category: 'login_page',
            label: 'login_button',
            value: 1,
        },
    },
    REGISTER_PAGE: {
        REGISTER: {
            action: 'register',
            category: 'register_page',
            label: 'register_button',
            value: 1,
        },
    },
    HOME_PAGE: {
        CLICK_BANNER: {
            action: 'click',
            category: 'home_page',
            label: 'banner',
            value: 1,
        },
    },
};
const wrapWithGAEvent =
    <T extends (...args: any[]) => unknown>(fn: T, eventInfo: UaEventOptions) =>
    (...args: any[]) => {
        ReactGA.event(eventInfo);

        return fn(...args);
    };
// 사용 예시
const myFunction = (message: string) => {
    console.log(message);
};
const wrappedFunction = wrapWithGAEvent(myFunction, EVENTS.LOGIN_PAGE.LOGIN);

wrappedFunction('로그인 성공!');
