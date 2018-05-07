import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ProcessApi, CategoryApi } from './api';
import { Filters, List, Pagination } from './components';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processes: [],
      categories: {
        0: { createdBy: 'a', displayName: 'All Categories', name: 'all', description: 'All Categories among processes', creation_date: 'a', id: '0' }
      },
      pagination: { page: 0, size: 10, total: 0 }, // avoid NaN errors
      filters: {
        categoryId: '0',
        search: '',
        order: 'DESC'
      }
    };

    this.fetchPage = this.fetchPage.bind(this);
    this.fetchCategories = this.fetchCategories.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.toggleOrder = this.toggleOrder.bind(this);
  }

  componentDidMount() {
    this.fetchPage();
    this.fetchCategories();
  }

  fetchPage(page = 0, _filters) {
    const { pagination, filters } = this.state;

    ProcessApi.fetchPage({ ...pagination, page }, { ...filters, ..._filters })
              .then(({ processes, pagination }) => this.setState({ processes, pagination }));
  }

  fetchCategories() {
    CategoryApi.fetchAll()
               .then((categories) => this.setState((prevState) => ({
                 categories: categories.reduce(
                   (categories, category) => {
                     categories[category.id] = category;
                     return categories;
                   },
                   prevState.categories
                 )
               })));
  }

  updateFilters(_filters) {
    this.fetchPage(0, _filters);
    this.setState((prevState) => ({ filters: { ...prevState.filters, ..._filters }}));
  }

  toggleOrder() {
    const order = { DESC: 'ASC', ASC: 'DESC' }[this.state.filters.order];

    this.fetchPage(0, { order });
    this.setState((prevState) => ({ filters: { ...prevState.filters, order }}));
  }

  render() {
    const { processes, categories, pagination, filters } = this.state;

    return (
      <div className="container border">
        <h1>Processes</h1>
        <Filters filters={filters} categories={categories} onChange={this.updateFilters} />
        <List processes={processes} pagination={pagination} toggleOrder={this.toggleOrder} />
        <Pagination pagination={pagination} onChangePage={this.fetchPage} />
      </div>
    );
  }
}

export default App
