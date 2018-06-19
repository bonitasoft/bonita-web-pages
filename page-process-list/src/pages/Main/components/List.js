import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './List.css';

import {
    Panel,
    Table,
    Label,
    Glyphicon,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class List extends Component {
    render() {
        const {processes, pagination, filters} = this.props;
        const {page, size, total} = pagination;

        var panelBodyContent;
        var paginationStatus = "";

        if (processes && processes.length > 0) {

            // indexes of first and last elements on the page
            const start = page * size;
            const end = start + (processes.length - 1);

            paginationStatus = `${start + 1}-${end + 1} of ${total}`;
            panelBodyContent = <div>
                <Table striped responsive hover>
                    <thead>
                    <tr>
                        <th className="List-name" onClick={this.props.toggleOrder}>
                            <span>Name</span>
                            <Glyphicon
                                glyph={
                                    {ASC: 'chevron-up', DESC: 'chevron-down'}[filters.order]
                                }
                            />
                        </th>
                        <th>Version</th>
                        <th>Categories</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {processes.map(process => (
                        <tr className="List-process" key={process.id}>
                            <td>{process.displayName}</td>
                            <td>{process.version}</td>
                            <td>
                                {process.categories.map(category => (
                                    <Label key={category.id} bsStyle="default">
                                        {category.displayName}
                                    </Label>
                                ))}
                            </td>
                            <td>{process.description}</td>
                            <td>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`new_case_${process.id}`}>
                                            Start a new case
                                        </Tooltip>
                                    }
                                >
                                    <Link
                                        to={`/instantiation/${process.name}/${
                                            process.version
                                            }?id=${process.id}&autoInstantiate=false`}
                                    >
                                        <Glyphicon glyph="play"/>
                                    </Link>
                                </OverlayTrigger>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <p className="List-pagination-bottom">{paginationStatus}</p>
            </div>
        } else {
            panelBodyContent = <p className="text-muted animated fadeIn ng-binding">No processes to display</p>
        }

        return (
            <Panel className="List">
                <Panel.Heading>
                    <Panel.Title componentClass="h3">List</Panel.Title>
                    <div className="List-heading-right">
                        <p className="List-pagination-top">{paginationStatus}</p>
                    </div>
                </Panel.Heading>
                <Panel.Body>
                    {panelBodyContent}
                </Panel.Body>
            </Panel>
        );
    }
}

const {string, oneOf, shape, arrayOf, objectOf, func} = PropTypes;

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
