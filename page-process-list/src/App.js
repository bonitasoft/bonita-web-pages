import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ProcessApi } from './api';

import List from './components/List';
import Pagination from './components/Pagination';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processes: [],
      pagination: {}
    };

    this.fetchPage = this.fetchPage.bind(this);
  }

  componentDidMount() {
    this.fetchPage();
  }

  fetchPage(page = 0) {
    const { pagination } = this.state;

    ProcessApi.fetchPage({ ...pagination, page }).then(({ processes, pagination }) => this.setState({ processes, pagination }));
  }

  render() {
    const { processes, pagination } = this.state;

    return (
      <div className="container border">
        <h1>Processes</h1>
        <List processes={processes} pagination={pagination} />
        <Pagination pagination={pagination} onChangePage={this.fetchPage} />
      </div>
    );
  }
}

export default App
