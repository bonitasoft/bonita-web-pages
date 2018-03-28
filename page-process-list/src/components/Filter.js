import React, { Component } from 'react';
import './Filter.css';

import { Panel, DropdownButton, Button, MenuItem, Form, FormGroup, FormControl, Glyphicon } from 'react-bootstrap';


class Filter extends Component {

  constructor(props) {
    super(props);

    this.submit = this.props.onChange; // an alias that is more explicit

    // to have "this" available inside function
    this.selectCategory = this.selectCategory.bind(this);
  }

  selectCategory(category) {
    this.props.filter.category = category;
    this.submit();
  }

  render() {
    const { categories, filter } = this.props;
    const { category } = filter;

    return (
      <Panel id="filter">
        <Panel.Heading>
          <Panel.Title componentClass="h3">Filter</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form onSubmit={(e) => { e.preventDefault() /*to avoid page refresh*/; this.submit(); }}>
            <DropdownButton
              xs={4} md={6}
              title={category.displayName}
              onSelect={this.selectCategory}
              key="filter-category" id="filter-category"
            >
              {
                categories.map((category) =>
                  <MenuItem eventKey={category} key={category.id}>{category.displayName}</MenuItem>)
              }
            </DropdownButton>
            <FormGroup xs={8} md={6} id="filter-search">
              <FormControl
                type="text"
                placeholder="Search..."
                onChange={(e) => this.props.filter.search = e.target.value}
              />
              <Button onClick={this.submit}>
                <Glyphicon glyph="search" />
              </Button>
            </FormGroup>

          </Form>
        </Panel.Body>
      </Panel>
    );
  }
}

export default Filter;
