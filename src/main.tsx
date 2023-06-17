import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from 'App';
import { worker } from '@mocks/browser';
import NavigationBar from '@components/NavigationBar';

if (import.meta.env.DEV) {
  await worker.start();
}

const container = document.getElementById('root') as HTMLElement;
const element = (
  <BrowserRouter>
    <div className="flex">
      <NavigationBar />
      <App />
    </div>
  </BrowserRouter>
);
createRoot(container).render(element);
