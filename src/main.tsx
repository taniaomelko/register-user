import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

async function enableMocking() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser')
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
  } else if (process.env.NODE_ENV === 'production') {
    const { worker } = await import('./mocks/browser');
    worker.start({
      serviceWorker: {
        url: `${process.env.PUBLIC_URL}/register-user/mockServiceWorker.js`,
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
