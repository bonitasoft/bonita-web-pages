import React, {Component} from 'react';
import './App.css';
import fetchProcesses from '@bonita/api/src/fetchProcesses.js';
import 'bootstrap/dist/css/bootstrap.css';
import {Jumbotron} from 'react-bootstrap';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            processes: []
        };
    }

    componentDidMount() {
        fetchProcesses().then((processes) => this.setState({processes}));
    }

    render() {
        const {processes} = this.state;

        return (
            <Jumbotron>
                <h1>Hello world with React!</h1>
                <ul>
                    {
                        processes.map((process) => <li>{process.displayName}</li>)
                    }
                </ul>

            </Jumbotron>
        );
    }
}

export default App;
