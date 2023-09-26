import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Enchiridion } from './components/Enchiridion';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider } from './providers/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
      <BrowserRouter>
        <Enchiridion />
      </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
