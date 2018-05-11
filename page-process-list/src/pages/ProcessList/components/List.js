import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './List.css';

import { Panel, Table, Label, Glyphicon } from 'react-bootstrap';


class List extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { processes, pagination, filters } = this.props;
    const { page, size, total } = pagination;

    // indexes of first and last elements on the page
    const start = page*size;
    const end = start + (processes.length-1);

    const paginationDisplay = (total !== 0) ? `${start + 1}-${end + 1} of ${total}` : 'no processes';


    return (
      <Panel className="List">
        <Panel.Heading>
          <Panel.Title componentClass="h3">List</Panel.Title>
          <div className="List-heading-right">
            <p className="List-pagination-top">{ paginationDisplay }</p>
          </div>
        </Panel.Heading>
        <Panel.Body>
          <Table striped hover>
            <thead>
            <tr>
              <th className="List-name" onClick={this.props.toggleOrder}>
                <Glyphicon glyph={(filters.order === 'ASC') ? 'chevron-up' : 'chevron-down'} />
                <span>Name</span>
              </th>
              <th>Version</th>
              <th>Categories</th>
              <th>Description</th>
            </tr>
            </thead>
            <tbody>
            {
              processes.map((process) =>
                <tr className="List-process" key={process.id}>
                  <td>{ process.displayName }</td>
                  <td>{ process.version }</td>
                  <td>
                    {
                      process.categories.map((category) =>
                        <Label key={category.id} bsStyle="default">{category.displayName}</Label>
                      )
                    }
                  </td>
                  <td>{ process.description }</td>
                </tr>
              )
            }
            </tbody>
          </Table>
        </Panel.Body>
        <p className="List-pagination-bottom">{ paginationDisplay }</p>
      </Panel>
    );
  }
}


const { string, oneOf, shape, arrayOf, objectOf, func } = PropTypes;

const categoryType = shape({
  createdBy: string,
  displayName: string,
  name: string,
  description: string,
  creation_date: string,
  id: string
});

const processType = shape({
  displayDescription: string,
  deploymentDate: string,
  displayName: string,
  categories: arrayOf(categoryType),
  name: string,
  description: string,
  deployedBy: string,
  id: string,
  activationState: oneOf([ 'ENABLED', 'DISABLED' ]),
  version: string,
  configurationState: oneOf([ 'UNRESOLVED', 'RESOLVED', 'DEACTIVATED', 'ACTIVATED' ]),
  last_update_date: string,
  actorinitiatorid: string
});

List.propTypes = {
  processes: arrayOf(processType),
  filters: objectOf(string),
  toggleOrder: func
};

export default List