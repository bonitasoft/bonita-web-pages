import React, { Component } from 'react';
import './Filter.css';

import { Panel, DropdownButton, Button, MenuItem, FormGroup, InputGroup, FormControl, Glyphicon } from 'react-bootstrap';


class Filter extends Component {

  constructor(props) {
    super(props);

    this.selectCategory = this.selectCategory.bind(this); //to have this available inside selectCategory
  }

  selectCategory(category) {
    this.props.filter.category = category;
    this.props.onChange();
  }

  render() {
    const { categories, filter, onChange } = this.props;
    const { category, search } = filter;

    return (
      <Panel id="filter">
        <Panel.Heading>
          <Panel.Title componentClass="h3">Filter</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <form>
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
            <FormGroup xs={8} md={6}>
              <InputGroup>
                <FormControl
                  type="text"
                  value={search}
                  placeholder="Search..."
                  onChange={onChange}
                />
                <Button componentClass={InputGroup.Button}>
                  <Glyphicon glyph="search" />
                </Button>
              </InputGroup>
            </FormGroup>
          </form>
        </Panel.Body>
      </Panel>
    );
  }
}

export default Filter;
