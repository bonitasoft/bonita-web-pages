/**
 * Copyright (C) 2018 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
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
