import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import fetchProcesses from './common/requests/fetchProcesses';

import List from './components/List';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processes: []
    };
  }

  componentDidMount() {
    fetchProcesses()
      .then((processes) => this.setState({ processes }));
  }

  render() {
    const { processes } = this.state;

    return (
      <div>
        <h1>Processes</h1>
        <List processes={processes} />
      </div>
    );
  }
}

export default App
