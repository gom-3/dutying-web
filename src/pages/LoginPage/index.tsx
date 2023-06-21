import 'index.css';
import { useUserLoggedIn } from 'stores/userStore';

const LoginPage = () => {
  const isLoggedIn = useUserLoggedIn();

  console.log(isLoggedIn);

  return <div className="">123</div>;
};

export default LoginPage;
