import React, { Component } from 'react';
import './Pagination.scss';

import { Pagination } from 'react-bootstrap';


class _Pagination extends Component {

  render() {
    const { pagination } = this.props;

    return (
      <Pagination>
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item>{pagination.page}</Pagination.Item>
        <Pagination.Next />
        <Pagination.Last />
      </Pagination>
    );

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
