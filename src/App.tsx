import { Router } from '@pages/Router';
import { event, sendEvent } from 'analytics';
import { hackleClient } from 'initializeApp';
import { useEffect } from 'react';
import { useAccount } from 'store';

function App() {
  const { account } = useAccount();
  useEffect(() => {
    if (account.nurseId) {
      sendEvent(event.login, account.nurseId.toString());
      hackleClient.setUserId(account.nurseId.toString()); // @TODO 로그인 부착 시 삭제
    }
  }, []);
  return <Router />;
}

export default App;
