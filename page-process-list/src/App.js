import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

import Filter from './components/Filter.js';
import List from './components/List.js';
import Pagination from './components/Pagination.js';

import fetchProcesses from './common/api/src/fetchProcesses.js';
import fetchCategories from './common/api/src/fetchCategories.js';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processes: [],
      categories: [
        { displayName: 'All Categories', id: null }
      ],
      filter: {
        category: {}, //init category at All
        search: '',
        order: 'ASC'
      },
      pagination: {
        start: 0,
        end: 0,
        total: 0,
        page: 0,
        count: 10
      }
    };

    this.state.filter.category = this.state.categories[0]; //init category at All

    // to have "this" available inside function
    this.fetchProcessesAndPopulateCategories = this.fetchProcessesAndPopulateCategories.bind(this);
    this.fetchProcesses = this.fetchProcesses.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentDidMount() {
    this.fetchProcesses();
    fetchCategories().then(({ data: categories }) => this.setState({ categories: [ this.state.categories[0], ...categories ]}));
  }


  // fetch processes then populate categories for each process (the API does not give provide a way to populate
  // categories when fetching an array of processes)
  fetchProcessesAndPopulateCategories(page = 0) {
    fetchProcesses({ ...this.state.filter, ...this.state.pagination, page })
      .then(({ data: processes, pagination }) => this.setState({ processes, pagination }))
      .populateCategories((processes) => this.setState({ processes }));
  }

  fetchProcesses() {
    this.fetchProcessesAndPopulateCategories();
  }

  changePage(page) {
    this.fetchProcessesAndPopulateCategories(page);
  }

  toggleOrder() {
    const { filter } = this.state;
    const { order } = filter;

    this.setState({
      filter: { ...filter, order: (order === 'ASC') ? 'DESC' : 'ASC'}
    });
    this.fetchProcesses();
  }

  render() {
    const { processes, categories, filter, pagination } = this.state;

    return (
      <div className="container border">
        <h1>Processes</h1>
        <Filter filter={filter} categories={categories} onChange={this.fetchProcesses} />
        <List processes={processes} pagination={pagination} filter={filter} toggleOrder={this.toggleOrder} />
        <Pagination pagination={pagination} onChangePage={this.changePage} />
      </div>
    );
  }
}

export default App;
