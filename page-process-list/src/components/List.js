import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './List.css';

import { Panel, Table, Label } from 'react-bootstrap';


class List extends Component {

  render() {
    const { processes } = this.props;

    return (
      <Panel className="List">
        <Panel.Heading>
          <Panel.Title componentClass="h3">List</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Table striped hover>
            <thead>
            <tr>
              <th>Name</th>
              <th>Version</th>
              <th>Categories</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {
              processes.map((process) =>
                <tr key={process.id}>
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
            )}
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