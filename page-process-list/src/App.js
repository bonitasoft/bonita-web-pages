import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

import Filter from './components/Filter.js';
import List from './components/List.js';
import Pagination from './components/Pagination.js';

import fetchProcesses from './common/api/src/fetchProcesses.js';
import fetchCategories from './common/api/src/fetchCategories.js';
import fetchCategoriesByProcess from './common/api/src/fetchCategoriesByProcess.js';


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
  }

  componentDidMount() {
    this.fetchProcesses();
    fetchCategories().then(({ data: categories }) => this.setState({ categories: [ this.state.categories[0], ...categories ]}));
  }

  fetchProcesses(page = 0) { // fetch first page by default
    fetchProcesses({ ...this.state.filter, ...this.state.pagination, page }).then(({ data: processes, pagination }) => {
      this.setState({ processes: processes.map((process) => ({ ...process, categories: [] })), pagination });

      // populate categories for each process
      processes.forEach((process) => fetchCategoriesByProcess(process.id).then(
        ({ data: categories }) => {
          process.categories = categories.map((category) => category.displayName);
          this.setState({
            processes: [ ...this.state.processes, process ]
          });
        }
      ))
    });
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
        <Filter filter={filter} categories={categories} onChange={() => this.fetchProcesses()} />
        <List processes={processes} pagination={pagination} filter={filter} toggleOrder={this.toggleOrder} />
        <Pagination pagination={pagination} />
      </div>
    );
  }
}

export default App;
