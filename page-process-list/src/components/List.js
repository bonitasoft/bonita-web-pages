import React, { Component } from 'react';
import './List.scss';

import { Panel, Table, Label, Button, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

const actions = [
  {
    displayName: 'View process overview',
    icon: 'eye-open'
  },
  {
    displayName: '',
    icon: 'list'
  }
];


class List extends Component {

  static showSettings() {
    //TODO
  }

  render() {
    const { processes, filter, pagination } = this.props;
    const { order } = filter;
    const { start, end, total } = pagination;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3">List</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <div>
            <Button onClick={this.showSettings}>
              <Glyphicon glyph="cog" />
            </Button>
            <p>{`${start}-${end} of ${total}`}</p>
          </div>
          <Table striped hover>
            <thead>
            <tr>
              <th className="process-name" onClick={this.toggleOrder}>
                <span>Name</span>
                <Glyphicon glyph={'chevron-' + (order === 'ASC') ? 'down' : 'up'} />
              </th>
              <th>Version</th>
              <th>Categories</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {processes.map((process, i) =>
              <tr key={"tr"+i}>
                <td>{process.displayName}</td>
                <td>{process.version}</td>
                <td>
                  {
                    process.categories.map((category, k) =>
                      <Label key={"label"+k} bsStyle="default">{category}</Label>
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

export default List;
