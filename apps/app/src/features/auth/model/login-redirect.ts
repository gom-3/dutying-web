import {resolveSafeRedirectTarget} from '@/shared/config/runtime';

export type TLoginRedirectDecision = {type: 'none'} | {type: 'history-back'} | {type: 'replace'; href: string};

type TRedirectTargetResolver = (target: string | null | undefined) => string;
type TLoginRedirectExecutor = {
    back: () => void;
    replace: (href: string) => void;
};

export const getLoginRedirectDecision = (
    nextPageUrl?: string | null,
    resolveRedirectTarget: TRedirectTargetResolver = resolveSafeRedirectTarget,
): TLoginRedirectDecision => {
    if (nextPageUrl === null) {
        return {type: 'none'};
    }

    const redirectTarget = resolveRedirectTarget(nextPageUrl);

    if (redirectTarget === 'back') {
        return {type: 'history-back'};
    }

    return {
        type: 'replace',
        href: redirectTarget,
    };
};

const defaultExecutor = (): TLoginRedirectExecutor => ({
    back: () => window.history.back(),
    replace: (href: string) => location.replace(href),
});

export const executeLoginRedirect = (decision: TLoginRedirectDecision, executor: TLoginRedirectExecutor = defaultExecutor()) => {
    if (decision.type === 'history-back') {
        executor.back();

        return;
    }

    if (decision.type === 'replace') {
        executor.replace(decision.href);
    }
};
