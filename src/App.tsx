import { Router } from '@pages/Router';
// import { useEffect } from 'react';
// import { getAccountMe } from '@libs/api/account';
// import { useQuery } from '@tanstack/react-query';
// import { useAccount } from 'store';

function App() {
  // const { setAccount } = useAccount();
  // useQuery(['account'], getAccountMe, {
  //   onSuccess: (account) => setAccount(account),
  //   onError: () => setAccount(null),
  // });
  return <Router />;
}

export default App;
