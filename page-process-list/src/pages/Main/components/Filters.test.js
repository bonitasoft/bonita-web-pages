import React from 'react';
import Filters from './Filters';

import { shallow, mount } from 'enzyme';

const mockupState = {
  categories: [...Array(25).keys()].reduce(
    (categories, i) => {
      categories[i] = {
        createdBy: '4',
        displayName: 'azdfesfe',
        name: 'azdfesfe',
        description: '',
        creation_date: '2018-03-02 11:05:39.490',
        id: i.toString()
      };
      return categories;
    },
    {
      all: {
        createdBy: 'a',
        displayName: 'All Categories',
        name: 'all',
        description: 'All Categories among processes',
        creation_date: 'a',
        id: 'all'
      }
    }
  ),
  filters: {
    categoryId: '0',
    search: ''
  }
};

describe('<Filters />', () => {
  const updateFiltersMock = jest.fn();

  it('should render as many categories as given, inside the dropdown menu', () => {
    const wrapper = shallow(
      <Filters {...mockupState} onChange={updateFiltersMock} />
    );
    expect(wrapper.find('.Filters-category-item')).toHaveLength(25 + 1);
  });

  it('should update the categoryId with the id of the category represented by the MenuItem that is clicked', () => {
    const wrapper = mount(
      <Filters {...mockupState} onChange={updateFiltersMock} />
    );
    wrapper
      .find('.Filters-category-item a')
      .at(0)
      .simulate('click');
    expect(updateFiltersMock.mock.calls[0]).toEqual([{ categoryId: '0' }]);
  });
});
