import React, { Component } from 'react';
import './Pagination.css';

import { Pagination } from 'react-bootstrap';


class _Pagination extends Component {

  render() {
    const { pagination } = this.props;
    const { page, end, count, total } = pagination;

    const hasPreviousPage = page !== 0,
          hasNextPage = page * count + end < total; // nb on the previous pages (if any) + nb on the current page < total
    const pager = [];

    if (hasPreviousPage) pager.push(<Pagination.First />, <Pagination.Prev />);
    pager.push(<Pagination.Item>{page + 1}</Pagination.Item>);
    if (hasNextPage) pager.push(<Pagination.Next />, <Pagination.Last />);

    return (hasPreviousPage || hasNextPage) ? <Pagination>{ pager }</Pagination> : null;

    /*return ( //TODO
      <Pagination>
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Ellipsis />

        <Pagination.Item>{10}</Pagination.Item>
        <Pagination.Item>{11}</Pagination.Item>
        <Pagination.Item active>{12}</Pagination.Item>
        <Pagination.Item>{13}</Pagination.Item>
        <Pagination.Item disabled>{14}</Pagination.Item>

        <Pagination.Ellipsis />
        <Pagination.Item>{20}</Pagination.Item>
        <Pagination.Next />
        <Pagination.Last />
      </Pagination>
    );*/
  }
}

export default _Pagination;
