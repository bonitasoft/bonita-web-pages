import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processes: [
        { name: 'process1' },
        { name: 'process2' }
      ]
    };
  }

  render() {
    const { processes } = this.state;

    return (
      <div>
        <h1>Hello world with React</h1>
        <ul>
          {
            processes.map((process) => <li>{process.name}</li>)
          }
        </ul>
      </div>
    );
  }
}

export default App;
