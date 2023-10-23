import useAuth from '@hooks/auth/useAuth';
import { Router } from '@pages/Router';

function App() {
  useAuth(true);
  return <Router />;
}

export default App;
