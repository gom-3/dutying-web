import setupLocatorUI from '@locator/runtime';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {createRoot} from 'react-dom/client';
import {Toaster} from 'react-hot-toast';
import {BrowserRouter} from 'react-router-dom';
import App from '@/app/App';
import {initializeProfileImageStore} from '@/features/file';
import Loading from '@/widgets/loading';
import Tutorial from '@/widgets/tutorial';
import initializeApp from './initializeApp';
import './index.css';
import './i18n';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 10,
        },
    },
});

if (import.meta.env.DEV) {
    setupLocatorUI();
}

initializeApp();
initializeProfileImageStore();

const container = document.getElementById('root') as HTMLElement;
const element = (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <App />
            <Toaster
                position="bottom-center"
                containerClassName="toaster"
                gutter={10}
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: '12px',
                        background: 'rgba(0, 0, 0, 0.82)',
                        color: '#FFFFFF',
                        boxShadow: 'none',
                        border: 'none',
                        padding: '12px 14px',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        maxWidth: 'none',
                        width: 'max-content',
                    },
                    success: {
                        style: {
                            borderRadius: '12px',
                            background: 'rgba(0, 0, 0, 0.82)',
                            color: '#FFFFFF',
                            boxShadow: 'none',
                            border: 'none',
                            whiteSpace: 'nowrap',
                            maxWidth: 'none',
                            width: 'max-content',
                        },
                    },
                    error: {
                        style: {
                            borderRadius: '12px',
                            background: 'rgba(0, 0, 0, 0.82)',
                            color: '#FFFFFF',
                            boxShadow: 'none',
                            border: 'none',
                            whiteSpace: 'nowrap',
                            maxWidth: 'none',
                            width: 'max-content',
                        },
                    },
                }}
            />
            <Loading />
            <Tutorial />
        </BrowserRouter>
    </QueryClientProvider>
);

createRoot(container).render(element);
