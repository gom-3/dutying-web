import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from 'App';
import './index.css';

const container = document.getElementById('root') as HTMLElement;
const element = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
createRoot(container).render(element);
