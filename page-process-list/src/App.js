import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Main } from './pages';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Instantiation from './pages/Main/components/Instantiation/Instantiation';
import PageTransition from 'react-router-page-transition';
import { Alerts } from './common';

class App extends Component {
  render() {
    if (Object.keys(this.props.session).length === 0) {
      return <div className="loader center" />;
    }
    return (
      <HashRouter>
        <div className="ProcessList">
          <Alerts className="ProcessList-alerts" />
          <Route
            render={({ location }) => (
              <PageTransition timeout={500}>
                <Switch location={location}>
                  <Route
                    exact
                    path="/"
                    render={() => <Main session={this.props.session} />}
                  />
                  <Route
                    path="/instantiation/:processName/:processVersion"
                    component={Instantiation}
                  />
                </Switch>
              </PageTransition>
            )}
          />
        </div>
      </HashRouter>
    );
  }
}

export default App;
