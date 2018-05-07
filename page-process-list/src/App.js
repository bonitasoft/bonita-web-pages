import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ProcessApi, CategoryApi } from './api';

import List from './components/List';
import Pagination from './components/Pagination';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processes: [],
      categories: [
        { createdBy: 0, displayName: 'All Categories', name: "all", description: "All Categories among processes", creation_date: "", id: 0 }
      ],
      pagination: { page: 0, size: 10, total: 0 } // avoid NaN errors
    };

    this.fetchPage = this.fetchPage.bind(this);
    this.fetchCategories = this.fetchCategories.bind(this);
  }

  componentDidMount() {
    this.fetchPage();
    this.fetchCategories();
  }

  fetchPage(page = 0) {
    const { pagination } = this.state;

    ProcessApi.fetchPage({ ...pagination, page }).then(({ processes, pagination }) => this.setState({ processes, pagination }));
  }

  fetchCategories() {
    CategoryApi.fetchAll().then((categories) => this.setState((prevState) => ({ categories: [ prevState.categories[0], ...categories ]})));
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
