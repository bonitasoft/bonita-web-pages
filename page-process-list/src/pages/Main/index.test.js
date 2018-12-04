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
import Main from './index';
import { shallow } from 'enzyme';
import fetchMock from 'fetch-mock';

describe('Main', () => {
  const push = jest.fn();
  const props = {
    history: { push: push },
    location: {},
    session: {
      user_id: 1
    }
  };

  it('should load processes and categories on mount', () => {
    const wrapper = shallow(<Main.WrappedComponent {...props} />, {
      disableLifecycleMethods: true
    }).instance();
    const getProcesses = jest.fn();
    const getCategories = jest.fn();
    wrapper.getProcesses = getProcesses;
    wrapper.getCategories = getCategories;

    wrapper.componentDidMount();

    expect(getProcesses).toHaveBeenCalled();
    expect(getCategories).toHaveBeenCalled();
  });

  it('should format page number for bonita API', () => {
    const wrapper = shallow(<Main.WrappedComponent {...props} />, {
      disableLifecycleMethods: true
    });
    let formatedNumber = wrapper.instance().formatPageNumberForBonitaAPI(2);
    expect(formatedNumber).toEqual(1);
    formatedNumber = wrapper.instance().formatPageNumberForBonitaAPI(0);
    expect(formatedNumber).toEqual(0);
  });

  describe('hasInstantiationFormMapping', () => {
    let component;
    beforeEach(() => {
      component = shallow(<Main.WrappedComponent {...props} />, {
        disableLifecycleMethods: true
      }).instance();
      fetchMock.config.overwriteRoutes = true;
    });
    it('should return false value if process has no instantiation form mapping ', async () => {
      const expectedResponse = [
        {
          id: '1114',
          processDefinitionId: '7979502914734350750',
          type: 'PROCESS_START',
          target: 'NONE',
          task: null,
          pageId: null,
          pageMappingKey: 'process/Pool1/1.0',
          lastUpdatedBy: '0',
          lastUpdateDate: null,
          formRequired: false,
          url: null
        }
      ];
      fetchMock.get(
        '../API/form/mapping?c=10&p=0&f=processDefinitionId%3D1114&f=type%3DPROCESS_START',
        {
          body: expectedResponse
        }
      );

      const hasNoFormMapping = await component.hasInstantiationFormMapping({
        id: '1114'
      });

      expect(hasNoFormMapping).toEqual(false);
    });

    it('should return true value if process has instantiation form mapping ', async () => {
      const expectedResponse = [
        {
          id: '1114',
          processDefinitionId: '7979502914734350750',
          type: 'PROCESS_START',
          target: 'INTERNAL',
          task: null,
          pageId: null,
          pageMappingKey: 'process/Pool1/1.0',
          lastUpdatedBy: '0',
          lastUpdateDate: null,
          formRequired: false,
          url: null
        }
      ];
      fetchMock.get(
        '../API/form/mapping?c=10&p=0&f=processDefinitionId%3D1114&f=type%3DPROCESS_START',
        {
          body: expectedResponse
        }
      );

      const hasNoFormMapping = await component.hasInstantiationFormMapping({
        id: '1114'
      });

      expect(hasNoFormMapping).toEqual(true);
    });
  });

  describe('startProcess', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<Main.WrappedComponent {...props} />, {
        disableLifecycleMethods: true
      }).instance();
    });

    it('should update state when user start a process without instantiation form', async () => {
      wrapper.hasInstantiationFormMapping = jest.fn().mockReturnValue(false);

      await wrapper.startProcess({
        version: '1.0',
        id: '12458725157',
        displayName: 'MyProcess'
      });

      expect(wrapper.state.show).toBe(true);
      expect(wrapper.state.process).toEqual({
        version: '1.0',
        id: '12458725157',
        displayName: 'MyProcess'
      });
      expect(push.mock.calls.length).toEqual(0);
    });

    it('should push to history when user start a process with instantiation form', async () => {
      wrapper.hasInstantiationFormMapping = jest.fn().mockReturnValue(true);

      await wrapper.startProcess({
        version: '1.0',
        id: '12458725157',
        displayName: 'MyProcess'
      });

      expect(!wrapper.state.process);
      expect(wrapper.state.show).toBe(false);
      expect(push.mock.calls.length).toEqual(1);
    });
  });
});
