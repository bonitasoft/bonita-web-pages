import React from 'react';
import Pagination from './Pagination';
import { Pager } from 'react-bootstrap';

import { shallow, mount } from 'enzyme';

import jsdom from 'jsdom';
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

describe('<Pagination />', () => {
  const changePageMock = jest.fn();

  it('should render null when there is no processes', () => {
    const wrapper = shallow(
      <Pagination
        pagination={{ total: 0, page: 0, size: 10 }}
        onChangePage={changePageMock}
      />
    );
    expect(wrapper.children()).toHaveLength(0);
  });

  it('should render null when page is the first and last page so the only page', () => {
    const wrapper = shallow(
      <Pagination
        pagination={{ total: 10, page: 0, size: 10 }}
        onChangePage={changePageMock}
      />
    );
    expect(wrapper.children()).toHaveLength(0);
  });

  it('should render three <Item /> components when total > size and page is the first page so egals 0', () => {
    const wrapper = shallow(
      <Pagination
        pagination={{ total: 30, page: 0, size: 10 }}
        onChangePage={changePageMock}
      />
    );
    expect(wrapper.children()).toHaveLength(3);
  });

  it('should render three <Item /> components when total > size and page is the last page', () => {
    const wrapper = shallow(
      <Pagination
        pagination={{ total: 30, page: 2, size: 10 }}
        onChangePage={changePageMock}
      />
    );
    expect(wrapper.children()).toHaveLength(3);
  });

  it('should render five <Item /> components when total > size and page is neither the first or last page', () => {
    const wrapper = shallow(
      <Pagination
        pagination={{ total: 30, page: 1, size: 10 }}
        onChangePage={changePageMock}
      />
    );
    expect(wrapper.children()).toHaveLength(5);
  });

  it('should call onPageChange with the right page parameter when all <Item /> is clicked', () => {
    const wrapper = mount(
      <Pagination
        pagination={{ total: 30, page: 1, size: 10 }}
        onChangePage={changePageMock}
      />
    );

    wrapper.find(Pager.Item).forEach(item => item.prop('onClick')());
    expect(changePageMock.mock.calls.map(args => args.join())).toEqual([
      '0',
      '0',
      '1',
      '2',
      '2'
    ]);
  });
});
