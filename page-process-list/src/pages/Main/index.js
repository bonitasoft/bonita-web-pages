import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { ProcessApi, CategoryApi } from '../../api';
import { Filters, List } from './components';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processes: [],
      categories: {
        0: {
          createdBy: 'a',
          displayName: 'All processes',
          name: 'all',
          description: 'All Categories among processes',
          creation_date: 'a',
          id: '0'
        }
      },
      pagination: { page: 0, size: 10, total: 0 }, // avoid NaN errors
      filters: {
        queryParams: '',
        categoryId: '0',
        search: '',
        order: 'ASC'
      }
    };

    this.getProcesses = this.getProcesses.bind(this);
    this.onPaginationChange = this.onPaginationChange.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.toggleOrder = this.toggleOrder.bind(this);
    this.buildParamForUser = this.buildParamForUser.bind(this);
  }

  componentDidMount() {
    this.getProcesses(0, this.state.filters, this.props.session.user_id);
    this.getCategories();
  }

  getProcesses(page = 0, _filters) {
    const { pagination } = this.state;
    const params = this.buildParamForUser(_filters);

    ProcessApi.fetchProcesses({ ...pagination, page }, params).then(
      ({ unpopulated, populated }) => {
        unpopulated.then(({ processes, pagination }) =>
          this.setState({ processes, pagination })
        );
        populated.then(({ processes }) => this.setState({ processes }));
      }
    );
  }

  onPaginationChange(pageFromPager, _filters) {
    this.getProcesses(
      this.formatPageNumberForBonitaAPI(pageFromPager),
      _filters
    );
  }

  formatPageNumberForBonitaAPI(page) {
    // As our pager manage pages starting by 1,
    // and bonita API start by 0, we need to convert the page number
    return page !== 0 ? page - 1 : page;
  }

  buildParamForUser(_filters) {
    const query = ['activationState=ENABLED'];
    let params = { ...this.state.filters, ..._filters };

    if (params.categoryId && params.categoryId !== '0') {
      query.push(`categoryId=${params.categoryId}`);
    }
    if (this.props.session.user_id && this.props.session.user_id !== '0') {
      query.push(`user_id=${this.props.session.user_id}`);
    }

    params.queryParams = query.join('&f=');
    this.setState({ filters: params });
    return params;
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
    this.getProcesses(0, _filters);
    this.setState(prevState => ({
      filters: { ...prevState.filters, ..._filters }
    }));
  }

  toggleOrder() {
    const order = { DESC: 'ASC', ASC: 'DESC' }[this.state.filters.order];
    this.getProcesses(0, { order }, this.props.session);
    this.setState(prevState => ({ filters: { ...prevState.filters, order } }));
  }

  render() {
    const { processes, categories, pagination, filters } = this.state;
    return (
      <div className="Main container border transition-item">
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
          toggleOrder={this.toggleOrder}
          onChangePage={this.onPaginationChange}
        />
      </div>
    );
  }
}

export default Main;
