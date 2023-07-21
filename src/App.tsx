import { Router } from '@pages/Router';
import { hackleClient } from 'initializeApp';

hackleClient.setUserId('test-user-1'); // @TODO 로그인 부착 시 삭제

function App() {
  return <Router />;
}

export default App;
