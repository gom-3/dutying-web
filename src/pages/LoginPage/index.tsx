import React from 'react';
import 'index.css';
import { useUserAction, useUserLoggedIn } from 'stores/userStore';

const LoginPage = () => {
  const userAction = useUserAction();
  const isLoggedIn = useUserLoggedIn();

  console.log(isLoggedIn);

  return <div className="">123</div>;
};

export default LoginPage;
