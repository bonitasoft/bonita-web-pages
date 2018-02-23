import React, { Component } from 'react';
import './App.css';
import fetchProcesses from './fetchProcesses.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        processes: []
    };
  }

  componentDidMount() {
    fetchProcesses().then((processes) => this.setState({ processes }));
  }

  render() {
    const { processes } = this.state;

    return (
      <div>
        <h1>Hello world with React</h1>
        <ul>
          {
            processes.map((process) => <li>{process.displayName}</li>)
          }
        </ul>
      </div>
    );
  }
}

export default App;
