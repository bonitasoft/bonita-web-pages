import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Main } from './pages';
import { HashRouter , Route } from 'react-router-dom';
import Instantiation from './pages/Main/components/Instantiation/Instantiation';

class App extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <Route exact path="/" component={Main} />
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
