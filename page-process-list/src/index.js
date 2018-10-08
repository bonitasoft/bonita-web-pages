import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n';
import './index.css';
import App from './App';
import SystemApi from './api/SystemApi';
import 'core-js';

SystemApi.fetchSession().then(session => {
  ReactDOM.render(
    <I18nextProvider i18n={i18n}>
      <App session={session} />
    </I18nextProvider>,
    document.getElementById('root')
  );
});
