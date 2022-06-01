/**
 * Copyright (C) 2018 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react';
import List from './List';

import { shallow } from 'enzyme';

const mockupProcesses = Array(25).fill({
  displayDescription: '',
  deploymentDate: '2018-02-14 12:18:34.254',
  displayName: 'Pool',
  name: 'Pool',
  description: '',
  deployedBy: '4',
  id: '7544905540282516773',
  activationState: 'ENABLED',
  version: '1.0',
  configurationState: 'RESOLVED',
  last_update_date: '2018-02-14 12:18:34.723',
  actorinitiatorid: '1',
  categories: []
});

describe('<List />', () => {
  const toggleOrderMock = jest.fn();
  const handleProcessStart = jest.fn();
  it('should render as many processes as given', () => {
    const wrapper = shallow(
      <List
        processes={mockupProcesses}
        pagination={{}}
        filters={{ order: 'DESC' }}
        toggleOrder={toggleOrderMock}
        handleProcessStart={handleProcessStart}
      />
    );

    expect(wrapper.find('.List-process')).toHaveLength(mockupProcesses.length);
  });

  it('should render a table from a non-empty array of processes with their displayName, version and categories', () => {
    const wrapper = shallow(
      <List
        processes={mockupProcesses}
        pagination={{}}
        filters={{ order: 'DESC' }}
        toggleOrder={toggleOrderMock}
        handleProcessStart={handleProcessStart}
      />
    );

    wrapper.find('.List-process').forEach((process_node, i) => {
      const process = mockupProcesses[i];
      const children = process_node.children();

      expect(children.at(0).text()).toBe(process.displayName);
      expect(children.at(1).text()).toBe(process.version);
      expect(children.at(2).children()).toHaveLength(process.categories.length);
    });
  });

  it('should display a well computed pagination', () => {
    const wrapper = shallow(
      <List
        processes={mockupProcesses}
        pagination={{ page: 1, size: 25, total: 100 }}
        filters={{ order: 'DESC' }}
        toggleOrder={toggleOrderMock}
        handleProcessStart={handleProcessStart}
      />
    );
    expect(wrapper.find('.List-pagination-top').text()).toBe('26-50 of 100');
  });

  it('should display a no processes if there is none', () => {
    const wrapper = shallow(
      <List
        processes={[]}
        pagination={{ page: 0, size: 25, total: 0 }}
        filters={{ order: 'DESC' }}
        toggleOrder={toggleOrderMock}
        handleProcessStart={handleProcessStart}
      />
    );

    expect(wrapper.find('.text-muted').text()).toBe('No process to display');
    expect(wrapper.find('Table')).toHaveLength(0);
  });

  it('should toggle order when name column header is clicked', () => {
    const wrapper = shallow(
      <List
        processes={mockupProcesses}
        pagination={{ page: 0, size: 25, total: 10 }}
        filters={{ order: 'DESC' }}
        toggleOrder={toggleOrderMock}
        handleProcessStart={handleProcessStart}
      />
    );
    wrapper.find('.List-name').prop('onClick')();

    expect(toggleOrderMock.mock.calls.length).toBe(1);
  });

  it('should push props history when table row is clicked', () => {
    const wrapper = shallow(
      <List
        processes={mockupProcesses}
        pagination={{ page: 0, size: 25, total: 10 }}
        filters={{ order: 'DESC' }}
        toggleOrder={toggleOrderMock}
        handleProcessStart={handleProcessStart}
      />
    );
    wrapper
      .find('.List-process')
      .first()
      .prop('onClick')();

    expect(handleProcessStart.mock.calls.length).toBe(1);
  });
});
