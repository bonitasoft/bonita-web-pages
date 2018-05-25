import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { ProcessApi, CategoryApi } from '../../api';
import { Filters, List, Pagination } from './components';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processes: [],
      categories: {
        0: {
          createdBy: 'a',
          displayName: 'All Categories',
          name: 'all',
          description: 'All Categories among processes',
          creation_date: 'a',
          id: '0'
        }
      },
      pagination: { page: 0, size: 25, total: 0 }, // avoid NaN errors
      filters: {
        categoryId: '0',
        search: '',
        order: 'ASC'
      }
    };

    this.getPage = this.getPage.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.toggleOrder = this.toggleOrder.bind(this);
  }

  componentDidMount() {
    this.getPage();
    this.getCategories();
  }

  getPage(page = 0, _filters) {
    const { pagination, filters } = this.state;

    ProcessApi.fetchProcesses(
      { ...pagination, page },
      { ...filters, ..._filters }
    ).then(({ unpopulated, populated }) => {
      unpopulated.then(({ processes, pagination }) =>
        this.setState({ processes, pagination })
      );
      populated.then(({ processes }) => this.setState({ processes }));
    });
  }

  getCategories() {
    CategoryApi.fetchAll().then(categories =>
      this.setState(prevState => ({
        categories: categories.reduce((categories, category) => {
          categories[category.id] = category;
          return categories;
        }, prevState.categories)
      }))
    );
  }

  updateFilters(_filters) {
    this.getPage(0, _filters);
    this.setState(prevState => ({
      filters: { ...prevState.filters, ..._filters }
    }));
  }

  toggleOrder() {
    const order = { DESC: 'ASC', ASC: 'DESC' }[this.state.filters.order];

    this.getPage(0, { order });
    this.setState(prevState => ({ filters: { ...prevState.filters, order } }));
  }

  render() {
    const { processes, categories, pagination, filters } = this.state;

    return (
      <div className="Main container border">
        <h1>Processes</h1>
        <Filters
          filters={filters}
          categories={categories}
          onChange={this.updateFilters}
        />
        <List
          processes={processes}
          pagination={pagination}
          filters={filters}
          onToggleOrder={this.toggleOrder}
        />
        <Pagination pagination={pagination} onChangePage={this.getPage} />
      </div>
    );
  }
}

export default Main;
