import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { ISSProvider } from './context/ISSContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardPage from './pages/DashboardPage';
import ISSPage from './pages/ISSPage';
import NewsPage from './pages/NewsPage';
import ChartsPage from './pages/ChartsPage';
import Chatbot from './chatbot/Chatbot';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ISSProvider>
          <ErrorBoundary>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="/iss" element={<ISSPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/charts" element={<ChartsPage />} />
              </Route>
            </Routes>

            {/* Global floating chatbot */}
            <Chatbot />

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--color-surface-2)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.75rem',
                  fontSize: '13px',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </ErrorBoundary>
        </ISSProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
