import { Router } from '@pages/Router';
import { event, sendEvent } from 'analytics';
import { hackleClient } from 'initializeApp';
import { useEffect } from 'react';
import useGlobalStore from 'store';

function App() {
  const { nurseId } = useGlobalStore();
  useEffect(() => {
    if (nurseId) {
      sendEvent(event.login, nurseId.toString());
      hackleClient.setUserId(nurseId.toString()); // @TODO 로그인 부착 시 삭제
    }
  }, []);
  return <Router />;
}

export default App;
