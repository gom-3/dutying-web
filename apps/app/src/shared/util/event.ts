import ReactGA from 'react-ga4';
/* eslint-disable @typescript-eslint/no-explicit-any */

type TReactGaEventOptions = Exclude<Parameters<typeof ReactGA.event>[0], string>;

export const wrapWithGAEvent =
    <T extends (...args: any[]) => unknown>(fn: T, eventInfo: TReactGaEventOptions) =>
    (...args: any[]) => {
        ReactGA.event(eventInfo);

        return fn(...args);
    };
