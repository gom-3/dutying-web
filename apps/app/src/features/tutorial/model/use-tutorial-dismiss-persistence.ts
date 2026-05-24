import {useCallback, useLayoutEffect} from 'react';
import {isTutorialDismissedForAccount, setTutorialDismissedForAccount, type TTutorialDismissKind} from './tutorial-dismiss-storage';

/**
 * 튜토리얼(InfoBox) 완료·건너뛰기 시 계정별로 브라우저 localStorage에 저장해,
 * 같은 accountId로 다시 들어왔을 때 오버레이가 다시 뜨지 않게 한다.
 * (다른 기기·브라우저에서는 서버 저장 없이는 공유되지 않음.)
 */
export function useTutorialDismissPersistence(
    kind: TTutorialDismissKind,
    accountId: number | null | undefined,
    setTutorialVisible: (show: boolean) => void,
): () => void {
    useLayoutEffect(() => {
        if (accountId == null) return;

        if (isTutorialDismissedForAccount(kind, accountId)) {
            setTutorialVisible(false);
        }
    }, [accountId, kind, setTutorialVisible]);

    return useCallback(() => {
        setTutorialVisible(false);

        if (accountId != null) {
            setTutorialDismissedForAccount(kind, accountId);
        }
    }, [accountId, kind, setTutorialVisible]);
}
