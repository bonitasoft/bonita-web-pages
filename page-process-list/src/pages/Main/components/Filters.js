import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Filters.css';
import { t } from 'i18next';

import {
  Panel,
  DropdownButton,
  Button,
  MenuItem,
  Form,
  FormGroup,
  FormControl,
  Glyphicon
} from 'react-bootstrap';

class Filters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: props.filters.search
    };

    this.searchInput = null;

    // to have "this" available inside function
    this.selectCategory = this.selectCategory.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  selectCategory(categoryId) {
    this.props.onChange({ categoryId });
  }

  clearSearch() {
    this.searchInput.focus();
    this.props.onChange({ search: '' });
    this.setState({ search: '' });
  }

  updateSearch() {
    this.props.onChange({ search: this.state.search });
  }

  render() {
    const { categories, filters } = this.props;
    const { search } = this.state;
    return (
      <Panel className="Filters">
        <Panel.Heading>
          <Panel.Title componentClass="h3">{t('Filters')}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form
            onSubmit={e => {
              e.preventDefault() /*to avoid page refresh*/;
              this.updateSearch();
            }}
          >
            <DropdownButton
              xs={4}
              md={6}
              title={categories[filters.categoryId].displayName}
              onSelect={this.selectCategory}
              key="Filters-category"
              className="Filters-category"
              id="Filters-category"
            >
              {Object.values(categories).map(category => (
                <MenuItem
                  className="Filters-category-item"
                  eventKey={category.id}
                  key={category.id}
                  active={filters.categoryId === category.id}
                >
                  {category.displayName}
                </MenuItem>
              ))}
            </DropdownButton>

            <FormGroup xs={8} md={6} className="Filters-search">
              <FormControl
                type="text"
                placeholder={t('Search') + '...'}
                value={search}
                onChange={e => this.setState({ search: e.target.value })}
                inputRef={ref => (this.searchInput = ref)}
              />
              <Button
                className="Filters-search-clear"
                style={{ visibility: search === '' ? 'hidden' : 'initial' }}
                onClick={this.clearSearch}
              >
                <Glyphicon glyph="remove" />
              </Button>
              <Button
                className="Filters-search-submit"
                onClick={this.updateSearch}
              >
                <Glyphicon glyph="search" />
              </Button>
            </FormGroup>
          </Form>
        </Panel.Body>
      </Panel>
    );
  }
}

const { string, func, objectOf, shape } = PropTypes;

const categoryType = shape({
  createdBy: string,
  displayName: string,
  name: string,
  description: string,
  creation_date: string,
  id: string
});

Filters.propTypes = {
  filters: objectOf(string),
  categories: objectOf(categoryType),
  onChange: func
};

export default Filters;
