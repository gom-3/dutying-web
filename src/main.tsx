import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from 'App';
import initializeApp from 'initializeApp';

initializeApp();

const container = document.getElementById('root') as HTMLElement;
const element = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
createRoot(container).render(element);
