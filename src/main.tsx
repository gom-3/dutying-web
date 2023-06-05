import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import initMocks from './mocks';
import router from 'router';

initMocks();

createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
);
