import React from 'react';
import Filters from './Filters';
import { MenuItem } from 'react-bootstrap';

import { shallow, mount } from 'enzyme';

import jsdom from 'jsdom';
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;


const mockupCategories = Array(25).map((value, i) => ({
  "createdBy":"4",
  "displayName":"azdfesfe",
  "name":"azdfesfe",
  "description":"",
  "creation_date":"2018-03-02 11:05:39.490",
  "id": i.toString()
}));

const mockupState = {
  categories: mockupCategories.reduce(
    (categories, category) => {
      categories[category.id] = category;
      return categories;
    },
    { 0: { createdBy: 'a', displayName: 'All Categories', name: 'all', description: 'All Categories among processes', creation_date: 'a', id: '0' }}
  ),
  filters: {
    categoryId: '0',
    search: ''
  }
};



describe('<Filters />', () => {

  const updateFiltersMock = jest.fn();

  it('should render as many categories as given, inside the dropdown menu', () => {
    const wrapper = mount(<Filters { ...mockupState } onChange={updateFiltersMock} />);
    expect(wrapper.find(MenuItem)).toHaveLength(mockupCategories.length + 1);
  });

  it('should update the categoryId when a MenuItem is clicked', () => {
    const wrapper = mount(<Filters { ...mockupState } onChange={updateFiltersMock} />);
    wrapper.find(MenuItem).first().prop('onClick')();
    expect(updateFiltersMock.mock.calls[0]).toEqual([ '0' ]);
  });

});