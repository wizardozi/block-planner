import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AppProvider } from './context/AppProvider';
import { DragAndDropProvider } from './context/DragAndDropProvider.jsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppProvider>
        <DragAndDropProvider>
          <App />
        </DragAndDropProvider>
      </AppProvider>
    </StrictMode>
  );
}
