import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './List.css';

import { Panel, Table, Label, Button, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

const actions = [
  {
    displayName: 'Show process overview',
    icon: 'eye-open'
  },
  {
    displayName: 'Start a new case',
    icon: 'play-circle'
  },
  {
    displayName: 'Show cases ?',
    icon: 'list'
  }
];


class List extends Component {

  static showSettings() {
    //TODO
  }

  render() {
    const { processes } = this.props;

    return (
      <Panel id="List">
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
            { processes.map((process, i) =>
              <tr key={"tr"+i}>
                <td>{process.displayName}</td>
                <td>{process.version}</td>
                <td>
                  {
                    process.categories.map((category, k) =>
                      <Label key={"label"+k} bsStyle="default">{category.displayName}</Label>
                    )
                  }
                </td>
                <td>
                  {
                    actions.map((action, j) =>
                      <OverlayTrigger placement="top" key={j} overlay={<Tooltip id={"action"+j}>{action.displayName}</Tooltip>}>
                        <Button /* TODO: onClick={} */>
                          <Glyphicon glyph={action.icon} />
                        </Button>
                      </OverlayTrigger>
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