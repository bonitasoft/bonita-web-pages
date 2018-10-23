import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Filters.css';
import { t } from 'i18next';

import {
  Button,
  DropdownButton,
  Form,
  FormControl,
  FormGroup,
  Glyphicon,
  HelpBlock,
  MenuItem,
  Panel
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
          <div>
            <DropdownButton
              xs={4}
              md={6}
              title={categories[filters.categoryId].displayName}
              onSelect={this.selectCategory}
              key="Filters-category"
              className="Filters-category"
              id="Filters-category"
              bsStyle="primary"
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
          </div>
          <Form
            onSubmit={e => {
              e.preventDefault() /*to avoid page refresh*/;
              this.updateSearch();
            }}
          >
            <FormGroup xs={8} md={6} className="Filters-search">
              <FormControl
                id="searchInput"
                type="text"
                placeholder={t('Search') + '...'}
                value={search}
                onChange={e => this.setState({ search: e.target.value })}
                inputRef={ref => (this.searchInput = ref)}
              />
              <div
                className="Filters-search-clear"
                style={{ visibility: search === '' ? 'hidden' : 'initial' }}
                onClick={this.clearSearch}
              >
                <Glyphicon glyph="remove" />
              </div>
              <Button
                className="Filters-search-submit"
                bsStyle="primary"
                onClick={this.updateSearch}
              >
                <Glyphicon glyph="search" />
              </Button>
              <div className="search-tooltip hide-on-mobile">
                <HelpBlock htmlFor="searchInput">
                  {t('On process name or version')}
                </HelpBlock>
              </div>
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
