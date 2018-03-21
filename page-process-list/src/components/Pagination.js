import React, { Component } from 'react';
import './Pagination.css';

import { Pagination } from 'react-bootstrap';


class _Pagination extends Component {

  render() {
    const { pagination } = this.props;
    const { page, end, total } = pagination;

    const pager = [];
    const isFirstPage = page === 0,
          isLastPage = end === total; // nb on the previous pages (if any) + nb on the current page < total

    if (!isFirstPage) pager.push(<Pagination.First />, <Pagination.Prev />);
    pager.push(<Pagination.Item>{page + 1}</Pagination.Item>);
    if (!isLastPage) pager.push(<Pagination.Next />, <Pagination.Last />);

    return (isFirstPage && isLastPage) ? null : <Pagination>{ pager }</Pagination>;
  }
}

export default _Pagination;
