
import React from 'react'
import { Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ProcessList, ProcessForm } from './pages';

const App = () => (
  <Switch>
    <Route exact path='/' component={ProcessList}/>
    <Route path='/form' component={ProcessForm}/>
  </Switch>
);

export default App