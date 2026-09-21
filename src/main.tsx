import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { PlatformProvider } from './context/PlatformContext';
import { FilterProvider } from './context/FilterContext';
import { NotificationProvider } from './context/NotificationContext';
import { ActionProvider } from './context/ActionContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlatformProvider>
        <FilterProvider>
          <NotificationProvider>
            <ActionProvider>
              <App />
            </ActionProvider>
          </NotificationProvider>
        </FilterProvider>
      </PlatformProvider>
    </BrowserRouter>
  </React.StrictMode>
);
