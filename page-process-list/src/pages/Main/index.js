/**
 * Copyright (C) 2018 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { ProcessApi, CategoryApi } from '../../api';
import FormApi from '../../api/FormApi';
import { Filters, List } from './components';
import Alert from '../../common/alerts';
import { withRouter } from 'react-router-dom';
import ConfirmModal from './components/Instantiation/ConfirmModal';
import { t } from 'i18next';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processes: [],
      categories: {
        0: {
          createdBy: 'a',
          displayName: t('AllCategories'),
          name: 'all',
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
      },
      show: false
    };

    this.getProcesses = this.getProcesses.bind(this);
    this.onPaginationChange = this.onPaginationChange.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.toggleOrder = this.toggleOrder.bind(this);
    this.buildParamForUser = this.buildParamForUser.bind(this);
    this.startProcess = this.startProcess.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.instantiateProcess = this.instantiateProcess.bind(this);
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

  async hasInstantiationFormMapping(process) {
    const greetingPromise = FormApi.fetchStartFormMapping(process.id);
    const data = await Promise.resolve(greetingPromise);
    return data[0] && data[0].target !== 'NONE';
  }

  async instantiateProcess() {
    const response = await ProcessApi.instantiateProcess(this.state.process.id);
    this.handleClose();
    if (response.caseId) {
      Alert.success(
        t('The case {{caseId}} has been started successfully.', {
          caseId: response.caseId
        })
      );
    } else {
      Alert.error(t('Error while starting the case.'));
    }
  }

  async startProcess(process) {
    if (await this.hasInstantiationFormMapping(process)) {
      this.props.history.push(
        `/instantiation/${process.name}/${process.version}?id=${
          process.id
        }&autoInstantiate=false`
      );
    } else {
      this.setState({ process: process, show: true });
    }
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

  handleClose() {
    this.setState({ show: false });
  }

  render() {
    const { processes, categories, pagination, filters } = this.state;
    const message = this.state.process
      ? t('Start a new case for process {{displayName}}', {
          displayName: this.state.process.displayName
        })
      : '';
    return (
      <div className="Main container border transition-item">
        <h1>{t('Processes')}</h1>
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
          startProcess={this.startProcess}
        />
        <ConfirmModal
          show={this.state.show}
          handleClose={this.handleClose}
          onConfirm={this.instantiateProcess}
          message={<h4>{message}</h4>}
        />
      </div>
    );
  }
}

export default withRouter(Main);
