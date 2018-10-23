import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './List.css';
import { t } from 'i18next';

import {
  Panel,
  Table,
  Label,
  Glyphicon,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import Pagination from 'react-js-pagination';

class List extends Component {
  constructor(props) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this);
  }

  onRowClick(process) {
    this.props.startProcess(process);
  }

  render() {
    const { processes, pagination, filters, onChangePage } = this.props;
    const { page, size, total } = pagination;

    var panelBodyContent;
    var paginationStatus = '';

    if (processes && processes.length > 0) {
      // indexes of first and last elements on the page
      const start = page * size;
      const end = start + (processes.length - 1);
      const of = t('of');
      paginationStatus = `${start + 1}-${end + 1} ${of} ${total}`;
      panelBodyContent = (
        <div>
          <Table striped responsive hover>
            <thead>
              <tr>
                <th className="List-name" onClick={this.props.toggleOrder}>
                  <span>{t('Name')}</span>
                  <Glyphicon
                    glyph={
                      { ASC: 'chevron-up', DESC: 'chevron-down' }[filters.order]
                    }
                  />
                </th>
                <th>{t('Version')}</th>
                <th className="hide-on-mobile">{t('Categories')}</th>
                <th className="hide-on-mobile">{t('Description')}</th>
                <th>{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {processes.map(process => (
                <OverlayTrigger
                  placement="top"
                  delayShow={500}
                  key={process.id}
                  overlay={
                    <Tooltip id={`new_case_${process.id}`}>
                      {t('Start a new case')}
                    </Tooltip>
                  }
                >
                  <tr
                    className="List-process start-process"
                    onClick={() => this.onRowClick(process)}
                  >
                    <td>{process.displayName}</td>
                    <td>{process.version}</td>
                    <td className="hide-on-mobile">
                      {process.categories.map(category => (
                        <Label key={category.id} bsStyle="default">
                          {category.displayName}
                        </Label>
                      ))}
                    </td>
                    <td className="hide-on-mobile">{process.description}</td>
                    <td className="process-action">
                      <Glyphicon glyph="play" />
                    </td>
                  </tr>
                </OverlayTrigger>
              ))}
            </tbody>
          </Table>
          <div className="List-pagination-bottom">
            <div>
              <p>{paginationStatus}</p>
            </div>
            <div className="List-pagination-bottom-element">
              <Pagination
                className="List-pagination-bottom"
                activePage={page + 1}
                itemsCountPerPage={size}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                onChange={onChangePage}
              />
            </div>
          </div>
        </div>
      );
    } else {
      panelBodyContent = (
        <p className="text-muted animated fadeIn ng-binding">
          {t('No process to display')}
        </p>
      );
    }

    return (
      <Panel className="List">
        <Panel.Heading>
          <Panel.Title componentClass="h3">{t('List')}</Panel.Title>
          <div className="List-heading-right">
            <p className="List-pagination-top">{paginationStatus}</p>
          </div>
        </Panel.Heading>
        <Panel.Body>{panelBodyContent}</Panel.Body>
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
  activationState: oneOf(['ENABLED', 'DISABLED']),
  version: string,
  configurationState: oneOf([
    'UNRESOLVED',
    'RESOLVED',
    'DEACTIVATED',
    'ACTIVATED'
  ]),
  last_update_date: string,
  actorinitiatorid: string
});

List.propTypes = {
  processes: arrayOf(processType),
  filters: objectOf(string),
  toggleOrder: func
};

export default List;
