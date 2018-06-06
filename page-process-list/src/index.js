import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import SystemApi from './api/SystemApi';

SystemApi.fetchSession().then(session => {
  ReactDOM.render(<App session={session} />, document.getElementById('root'));
});
