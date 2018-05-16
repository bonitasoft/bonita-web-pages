import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Pagination.css';

import { Pager, Glyphicon } from 'react-bootstrap';

const buildItem = onChangePage => ({ page, children, ...props }) => (
  <Pager.Item onClick={() => onChangePage(page)} {...props}>
    {children || page + 1}
  </Pager.Item>
);

class Pagination extends Component {
  constructor(props) {
    super(props);

    this.Item = buildItem(this.props.onChangePage);
  }

  render() {
    const { Item } = this;
    const { page, size, total } = this.props.pagination;

    const lastPage = Math.ceil(total / size) - 1;

    const isFirstPage = page === 0,
      isLastPage = page === lastPage, // nb on the previous pages (if any) + nb on the current page < total
      isSolePage = lastPage === 0;

    if (isSolePage) {
      return null;
    }

    const pager = [];

    if (!isFirstPage) {
      pager.push(
        <Item page={0} key="first" />,
        <Item previous page={page - 1} key="prev">
          <Glyphicon glyph="menu-left" />
        </Item>
      );
    }

    pager.push(<Item page={page} key="current" />);

    if (!isLastPage) {
      pager.push(
        <Item next page={page + 1} key="next">
          <Glyphicon glyph="menu-right" />
        </Item>,
        <Item page={lastPage} key="last" />
      );
    }

    return <Pager className="Pagination" children={pager} />;
  }
}

const { func, number, objectOf } = PropTypes;

Pagination.propTypes = {
  pagination: objectOf(number),
  onChangePage: func
};

export default Pagination;
