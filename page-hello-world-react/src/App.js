import React, { Component } from 'react';
import './App.css';
import fetchProcesses from '@bonita/api/src/fetchProcesses.js';

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
      <div className="container">
        <h1>Hello world with React</h1>
        <div className="flash">
            <button type="submit" className="btn btn-sm primary flash-action">Complete action</button>
            Flash message with action here.
        </div>
        <button className="btn btn-primary" type="button">Button</button>
        <a className="btn" href="https://primer.github.io/" role="button">Primer showroom</a>
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
