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
import ProcessApi from '../../api/ProcessApi';
import * as querystring from 'querystring';

describe('Main', () => {
  const push = jest.fn();
  const props = {
    history: { push: push },
    location: {},
    session: {
      user_id: 1,
    },
  };

  it('should load processes and categories on mount', () => {
    const wrapper = shallow(<Main.WrappedComponent {...props} />, {
      disableLifecycleMethods: true,
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
      disableLifecycleMethods: true,
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
        disableLifecycleMethods: true,
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
          url: null,
        },
      ];
      fetchMock.get(
        '../API/form/mapping?c=10&p=0&f=processDefinitionId%3D1114&f=type%3DPROCESS_START',
        {
          body: expectedResponse,
        }
      );

      const hasNoFormMapping = await component.hasInstantiationFormMapping({
        id: '1114',
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
          url: null,
        },
      ];
      fetchMock.get(
        '../API/form/mapping?c=10&p=0&f=processDefinitionId%3D1114&f=type%3DPROCESS_START',
        {
          body: expectedResponse,
        }
      );

      const hasNoFormMapping = await component.hasInstantiationFormMapping({
        id: '1114',
      });

      expect(hasNoFormMapping).toEqual(true);
    });
  });

  describe('handleProcessStart', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<Main.WrappedComponent {...props} />, {
        disableLifecycleMethods: true,
      }).instance();
    });

    it('should update state when user start a process without instantiation form', async () => {
      wrapper.hasInstantiationFormMapping = jest.fn().mockReturnValue(false);

      await wrapper.handleProcessStart({
        version: '1.0',
        id: '12458725157',
        displayName: 'My Process',
      });

      expect(wrapper.state.show).toBe(true);
      expect(wrapper.state.process).toEqual({
        version: '1.0',
        id: '12458725157',
        displayName: 'My Process',
      });
      expect(push.mock.calls.length).toEqual(0);
    });

    it('should push to history when user start a process with instantiation form', async () => {
      push.mockReset();
      delete window.location;
      window.location = { search: '?id=12&app=myAppToken' };
      wrapper.hasInstantiationFormMapping = jest.fn().mockReturnValue(true);

      await wrapper.handleProcessStart({
        version: '1.0',
        id: '12458725157',
        displayName: 'My Process',
        name: 'MyProcess',
      });

      expect(!wrapper.state.process);
      expect(wrapper.state.show).toBe(false);
      expect(push.mock.calls.length).toEqual(1);
      expect(push.mock.calls[0][0]).toEqual(
        '/instantiation/MyProcess/1.0?id=12458725157&autoInstantiate=false&app=myAppToken'
      );
    });

    it('should push to history without empty app param when user start a process with instantiation form', async () => {
      push.mockReset();
      delete window.location;
      window.location = { search: '?id=12' };
      wrapper.hasInstantiationFormMapping = jest.fn().mockReturnValue(true);

      await wrapper.handleProcessStart({
        version: '1.0',
        id: '12458725157',
        displayName: 'My Process',
        name: 'MyProcess',
      });

      expect(!wrapper.state.process);
      expect(wrapper.state.show).toBe(false);
      expect(push.mock.calls.length).toEqual(1);
      expect(push.mock.calls[0][0]).toEqual(
        '/instantiation/MyProcess/1.0?id=12458725157&autoInstantiate=false'
      );
    });

    it('should not keep the redirect param when instatiating process through list', async () => {
      push.mockReset();
      delete window.location;
      window.location = { search: '?id=12&redirect=task-list' };
      wrapper.hasInstantiationFormMapping = jest.fn().mockReturnValue(true);

      await wrapper.handleProcessStart({
        version: '1.0',
        id: '12458725157',
        displayName: 'My Process',
        name: 'MyProcess',
      });

      expect(push.mock.calls[0][0]).toEqual(
        '/instantiation/MyProcess/1.0?id=12458725157&autoInstantiate=false'
      );
    });
  });

  describe('redirectToInstantiationForm', () => {
    function generateWrapper(props, mountComponent) {
      let wrapper = shallow(<Main.WrappedComponent {...props} />, {
        disableLifecycleMethods: true,
      }).instance();

      wrapper.getProcesses = jest.fn();
      wrapper.getCategories = jest.fn();

      if (mountComponent) {
        wrapper.redirectToInstantiationForm = jest.fn();
        wrapper.componentDidMount();
      }

      return wrapper;
    }

    it('should not redirect to form if there are parameters that are missing', async () => {
      push.mockReset();
      delete window.location;

      window.location = { search: '?redirect=task-list' };
      props.location = window.location;
      let wrapper = generateWrapper(props, true);
      expect(wrapper.redirectToInstantiationForm.mock.calls.length).toBe(0);

      window.location = {
        search: '?redirect=task-list&processName=Pool',
      };
      props.location = window.location;
      wrapper = generateWrapper(props, true);
      expect(wrapper.redirectToInstantiationForm.mock.calls.length).toBe(0);

      window.location = {
        search: '?redirect=task-list&processVersion=1.0',
      };
      props.location = window.location;
      wrapper = generateWrapper(props, true);
      expect(wrapper.redirectToInstantiationForm.mock.calls.length).toBe(0);
    });

    it('should redirect to form if the process name and version are in the url', async () => {
      push.mockReset();
      delete window.location;
      window.location = {
        origin: 'http://localhost:8080',
        pathname: '/bonita/apps/process-list',
        search: '?processName=Pool&processVersion=1.0',
      };
      props.location = window.location;
      let wrapper = generateWrapper(props, true);

      expect(wrapper.redirectToInstantiationForm.mock.calls.length).toBe(1);
    });

    it('should not redirect to form if parameters are present but the process does not exist', async () => {
      push.mockReset();
      delete window.location;
      window.location = {
        origin: 'http://localhost:8080',
        pathname: '/bonita/apps/process-list',
        search: '?processName=Pool&processVersion=1.0',
      };
      props.location = window.location;
      let wrapper = generateWrapper(props, false);
      wrapper.redirectToInstantiationForm = jest.fn();
      wrapper.showInstantiationForm = jest.fn();
      ProcessApi.fetchProcessByNameAndVersion = jest
        .fn()
        .mockReturnValue(undefined);
      wrapper.componentDidMount();

      expect(wrapper.showInstantiationForm.mock.calls.length).toBe(0);
    });

    it('should show instantiation form if parameters are present', async () => {
      push.mockReset();
      delete window.location;
      window.location = {
        origin: 'http://localhost:8080',
        pathname: '/bonita/apps/process-list',
        search: '?processName=Pool&processVersion=1.0',
      };
      let query = querystring.parse(window.location.search.replace('?', ''));
      window.history.pushState = jest.fn();
      props.location = window.location;
      let wrapper = generateWrapper(props, false);
      wrapper.showInstantiationForm = jest.fn();
      const spyProcessAPI = jest.spyOn(
        ProcessApi,
        'fetchProcessByNameAndVersion'
      );
      spyProcessAPI.mockImplementation(() => Promise.resolve({ id: 12 }));
      await wrapper.redirectToInstantiationForm(query);

      expect(wrapper.showInstantiationForm.mock.calls.length).toBe(1);
      expect(window.history.pushState.mock.calls[0]).toEqual([
        {},
        '',
        'http://localhost:8080/bonita/apps/process-list',
      ]);
    });

    it('should redirect to instantiation form', async () => {
      push.mockReset();
      delete window.location;
      window.location = {
        origin: 'http://localhost:8080',
        pathname: '/bonita/apps/process-list',
        search: '?processName=Pool&processVersion=1.0&redirect=task-list',
      };
      let query = querystring.parse(window.location.search.replace('?', ''));
      window.history.pushState = jest.fn();
      props.location = window.location;
      let wrapper = generateWrapper(props, false);
      wrapper.hasInstantiationFormMapping = jest.fn().mockReturnValue(true);
      const spyProcessAPI = jest.spyOn(
        ProcessApi,
        'fetchProcessByNameAndVersion'
      );
      spyProcessAPI.mockImplementation(() =>
        Promise.resolve({ id: 12, name: 'Pool', version: '1.0' })
      );
      await wrapper.redirectToInstantiationForm(query);
      expect(push.mock.calls[0][0]).toBe(
        '/instantiation/Pool/1.0?redirect=task-list&id=12&autoInstantiate=false'
      );
    });

    it('should not redirect to instantiation form, but show modal when there is no form', async () => {
      push.mockReset();
      delete window.location;
      window.location = {
        origin: 'http://localhost:8080',
        pathname: '/bonita/apps/process-list',
        search: '?processName=Pool&processVersion=1.0&redirect=task-list',
      };
      let query = querystring.parse(window.location.search.replace('?', ''));
      window.history.pushState = jest.fn();
      props.location = window.location;
      let wrapper = generateWrapper(props, false);
      wrapper.hasInstantiationFormMapping = jest.fn().mockReturnValue(false);
      const spyProcessAPI1 = jest.spyOn(
        ProcessApi,
        'fetchProcessByNameAndVersion'
      );
      spyProcessAPI1.mockImplementation(() =>
        Promise.resolve({ id: 12, name: 'Pool', version: '1.0' })
      );
      const spyProcessAPI2 = jest.spyOn(ProcessApi, 'instantiateProcess');
      spyProcessAPI2.mockImplementation(() =>
        Promise.resolve({ caseId: '1234' })
      );
      await wrapper.redirectToInstantiationForm(query);
      expect(window.history.pushState.mock.calls[0]).toEqual([
        {},
        '',
        'http://localhost:8080/bonita/apps/process-list',
      ]);
      expect(push.mock.calls).toEqual([]);
      await wrapper.instantiateProcess();
      expect(window.location.href).toBe(
        'http://localhost:8080/bonita/apps/process-list../task-list'
      );
    });
  });
});
