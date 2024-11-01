import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

async function enableMocking() {
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: `${import.meta.env.VITE_PUBLIC_URL || ''}mockServiceWorker.js`,
      },
    });
  } else if (import.meta.env.MODE === 'production') {
    const { worker } = await import('./mocks/browser');
    worker.start({
      serviceWorker: {
        url: `${import.meta.env.VITE_PUBLIC_URL || ''}mockServiceWorker.js`,
      },
    });
  }
}
 
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  )
})
