import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Filters.css';

import { Panel, DropdownButton, Button, MenuItem, Form, FormGroup, FormControl, Glyphicon } from 'react-bootstrap';


class Filters extends Component {

  constructor(props) {
    super(props);

    this.state = {
      search: props.filters.search
    };

    // to have "this" available inside function
    this.selectCategory = this.selectCategory.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  selectCategory(categoryId) {
    this.props.onChange({ categoryId });
  }

  updateSearch() {
    this.props.onChange({ search: this.state.search});
  }

  render() {
    const { categories, filters } = this.props;

    return (
      <Panel className="Filters">
        <Panel.Heading>
          <Panel.Title componentClass="h3">Filters</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form onSubmit={(e) => { e.preventDefault() /*to avoid page refresh*/; this.updateSearch() }}>

            <DropdownButton
              xs={4} md={6}
              title={categories[filters.categoryId].displayName}
              onSelect={this.selectCategory}
              key="Filters-category" className="Filters-category" id="Filters-category"
            >
              {
                Object.values(categories)
                  .map((category) => <MenuItem eventKey={category.id} key={category.id} active={filters.categoryId === category.id}>{category.displayName}</MenuItem>)
              }
            </DropdownButton>

            <FormGroup xs={8} md={6} className="Filters-search">
              <FormControl
                type="text"
                placeholder="Search..."
                value={this.state.search}
                onChange={(e) => this.setState({ search: e.target.value })}
              />
              <Button onClick={this.updateSearch}>
                <Glyphicon glyph="search" />
              </Button>
            </FormGroup>

          </Form>
        </Panel.Body>
      </Panel>
    );
  }
}


const { string, func, objectOf } = PropTypes;

const categoryType = objectOf({
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

export default Filters