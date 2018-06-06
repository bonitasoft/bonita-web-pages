import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Main } from "./pages";
import { HashRouter, Route } from "react-router-dom";
import Instantiation from "./pages/Main/components/Instantiation/Instantiation";

class App extends Component {
  render() {
    if (Object.keys(this.props.session).length === 0) {
      return <div className="loader center" />;
    }
    return (
      <HashRouter>
        <div className="ProcessList">
          <Route
            exact
            path="/"
            render={() => <Main session={this.props.session} />}
          />
          <Route
            path="/instantiation/:processName/:processVersion"
            component={Instantiation}
          />
        </div>
      </HashRouter>
    );
  }
}

export default App;
