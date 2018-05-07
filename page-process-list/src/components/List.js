import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './List.css';

import { Panel, Table, Label } from 'react-bootstrap';


class List extends Component {

  render() {
    const { processes, pagination } = this.props;
    const { page, size, total } = pagination;

    // indexes of first and last elements on the page
    const start = page*size;
    const end = start + (processes.length-1);

    return (
      <Panel className="List">
        <Panel.Heading>
          <Panel.Title componentClass="h3">List</Panel.Title>
          <div className="List-info">
            <p>
              {
                (total !== 0)
                  ? `${start + 1}-${end + 1} of ${total}`
                  : 'no processes'
              }
            </p>
          </div>
        </Panel.Heading>
        <Panel.Body>
          <Table striped hover>
            <thead>
            <tr>
              <th>Name</th>
              <th>Version</th>
              <th>Categories</th>
            </tr>
            </thead>
            <tbody>
            {
              processes.map((process) =>
                <tr className="List-process" key={process.id}>
                  <td>{process.displayName}</td>
                  <td>{process.version}</td>
                  <td>
                    {
                      process.categories.map((category) =>
                        <Label key={category.id} bsStyle="default">{category.displayName}</Label>
                      )
                    }
                  </td>
                </tr>
              )
            }
            </tbody>
          </Table>
        </Panel.Body>
      </Panel>
    );
  }
}


const { string, number, oneOf, shape, arrayOf } = PropTypes;

const categoryType = shape({
  createdBy: number,
  displayName: string,
  name: string,
  description: string,
  creation_date: string,
  id: number
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
  processes: arrayOf(processType)
};

export default List