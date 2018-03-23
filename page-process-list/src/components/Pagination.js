import React, { Component } from 'react';
import './Pagination.css';

import { Pager, Glyphicon } from 'react-bootstrap';


const buildItem = (onChangePage) => ({ page, children, ...props }) =>
  <Pager.Item onClick={() => onChangePage(page)} {...props}>
    { children || page+1 }
  </Pager.Item>;


class Pagination extends Component {

  constructor(props) {
    super(props);

    this.Item = buildItem(this.props.onChangePage);
  }

  render() {
    const { Item } = this;
    const { page, total, count } = this.props.pagination;

    const lastPage = Math.floor(total/count);
    const isFirstPage = page === 0,
          isLastPage = page === lastPage, // nb on the previous pages (if any) + nb on the current page < total
          isOnlyPage = lastPage === 0;

    const pager = [];


    if (!isFirstPage) {
      pager.push(
        <Item page={0} key="0" />,
        <Item previous page={page-1} key="-1"><Glyphicon glyph="menu-left" /></Item>
      );
    }

    pager.push(<Item page={page} key={page} />);

    if (!isLastPage) {
      pager.push(
        <Item next page={page+1} key="+1"><Glyphicon glyph="menu-right" /></Item>,
        <Item page={lastPage} key={lastPage} />
      );
    }


    return (isOnlyPage) ? null : <Pager>{ pager }</Pager>;
  }
}

export default Pagination;
