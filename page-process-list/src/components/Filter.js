import React, { Component } from 'react';
import './Filter.scss';

import { Panel, Grid, Row, DropdownButton, Button, MenuItem, FormGroup, InputGroup, FormControl, Glyphicon } from 'react-bootstrap';


class Filter extends Component {

  selectCategory(category) {
    this.props.filter.category = category;
    this.props.onChange();
  }

  render() {
    const { categories, filter, onChange } = this.props;
    const { category, search } = filter;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3">Filter</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <form>
            <Grid>
              <Row>
                <DropdownButton
                  xs={4} md={6}
                  title={category.displayName}
                  onSelect={this.selectCategory}
                  key={category.id} id={category.id}
                >
                  {
                    categories.map((category) =>
                      <MenuItem eventKey={category}>{category.displayName}</MenuItem>)
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
              </Row>
            </Grid>
          </form>
        </Panel.Body>
      </Panel>
    );
  }
}

export default Filter;
