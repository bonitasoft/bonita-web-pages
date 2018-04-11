import React from 'react';
import Pagination from './Pagination';


import { shallow } from 'enzyme';


describe('<Pagination />', () => {

  const changePageMock = jest.fn().mockImplementation((page) => page);

  it('should render null when page is the first and last page so the only page', () => {
    const wrapper = shallow(<Pagination pagination={{ total: 10, page: 0, size: 10 }} onChangePage={changePageMock} />);
    expect(wrapper.children()).toHaveLength(0);
  });

  it('should render three <Item /> components when total > size and page is the first page so egals 0', () => {
    const wrapper = shallow(<Pagination pagination={{ total: 30, page: 0, size: 10 }} onChangePage={changePageMock} />);
    expect(wrapper.children()).toHaveLength(3);
  });

  it('should render three <Item /> components when total > size and page is the last page', () => {
    const wrapper = shallow(<Pagination pagination={{ total: 30, page: 2, size: 10 }} onChangePage={changePageMock} />);
    expect(wrapper.children()).toHaveLength(3);
  });

  it('should render five <Item /> components when total > size and page is neither the first or last page', () => {
    const wrapper = shallow(<Pagination pagination={{ total: 30, page: 1, size: 10 }} onChangePage={changePageMock} />);
    expect(wrapper.children()).toHaveLength(5);
  });

  it('should call onPageChange with the right page parameter when an <Item /> is clicked', () => {
    const wrapper = shallow(<Pagination pagination={{ total: 20, page: 1, size: 10 }} onChangePage={changePageMock} />);
    wrapper.children().forEach((item) => item.simulate('click'));
    expect(changePageMock.mock.calls).toBe([ '0', '0', '1', '2', '2']);
  });

});