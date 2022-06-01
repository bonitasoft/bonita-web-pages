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

import Instantiation from './Instantiation';
import { shallow } from 'enzyme';
import { Alerts } from '../../../../common';

describe('Instantiation page', () => {
  let props;

  beforeEach(() => {
    props = {
      match: {
        params: {
          processName: 'My process name',
          processVersion: '1.0'
        }
      },
      location: {
        search: '?id=1&autoInstantiate=false'
      }
    };
  });

  it('should display instantiation form into portal', () => {
    Object.defineProperty(window.location, 'href', {
      writable: true,
      value:
        'http://localhost:8080/bonita/portal/homepage#?_p=tasklistinguser&_pf=1'
    });
    const wrapper = shallow(<Instantiation {...props} />);

    expect(wrapper.find('iframe').prop('src')).toEqual(
      'http://localhost:8080/bonita/portal/resource/process/My process name/1.0/content/?id=1&autoInstantiate=false'
    );
  });

  it('should display instantiation form into LA', () => {
    Object.defineProperty(window.location, 'href', {
      writable: true,
      value:
        'http://localhost:8080/customWar/portal/resource/app/demo/process/content/?app=demo#/'
    });
    const wrapper = shallow(<Instantiation {...props} />);

    expect(wrapper.find('iframe').prop('src')).toEqual(
      'http://localhost:8080/customWar/portal/resource/process/My process name/1.0/content/?id=1&autoInstantiate=false'
    );
  });

  it('should update history on success submit message.', async () => {
    const testProps = {
      ...props,
      history: { push: jest.fn() }
    };
    shallow(<Instantiation {...testProps} />);

    // Simulate a message being sent
    var message = {
      action: 'Start process',
      message: 'success'
    };

    window.postMessage(message, '*');
    //New to add this Promise to allows message to be read
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(testProps.history.push).toHaveBeenCalledWith('/');
  });

  it('should redirect to the page from url after instantiating process', async () => {
    const testProps = {
      ...props,
      history: { push: jest.fn() }
    };
    testProps.location.search = '?redirect=task-list';

    Object.defineProperty(window.location, 'origin', {
      writable: true,
      value: 'http://localhost:8080'
    });
    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: '/bonita/apps/process-list'
    });

    shallow(<Instantiation {...testProps} />);

    // Simulate a message being sent
    var message = {
      action: 'Start process',
      message: 'success'
    };

    window.postMessage(message, '*');
    //New to add this Promise to allows message to be read
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(window.location.href).toBe(
      'http://localhost:8080/bonita/apps/process-list../task-list'
    );
    expect(testProps.history.push).not.toHaveBeenCalled();
  });

  it('should not update history on error submit message.', async () => {
    const testProps = {
      ...props,
      history: { push: jest.fn() }
    };
    shallow(<Instantiation {...testProps} />);

    // Simulate a message being sent
    var message = {
      action: 'Start process',
      message: 'error'
    };

    window.postMessage(message, '*');
    //New to add this Promise to allows message to be read
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(testProps.history.push).not.toHaveBeenCalled();
  });

  it('should not update history on success random message.', async () => {
    const testProps = {
      ...props,
      history: { push: jest.fn() }
    };
    shallow(<Instantiation {...testProps} />);

    // Simulate a message being sent
    var message = {
      action: 'Success random',
      message: 'success'
    };

    window.postMessage(message, '*');
    //New to add this Promise to allows message to be read
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(testProps.history.push).not.toHaveBeenCalled();
  });

  it('should deleted message listener when component is unmount.', async () => {
    window.removeEventListener = jest.fn();
    window.addEventListener = jest.fn();

    const wrapper = shallow(<Instantiation {...props} />);
    let onFormSubmitedMethod = wrapper.instance().onFormSubmited;
    expect(window.addEventListener).toHaveBeenCalledWith(
      'message',
      onFormSubmitedMethod,
      false
    );
    wrapper.unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'message',
      onFormSubmitedMethod
    );
  });

  describe('Toast', () => {
    beforeEach(() => {
      Alerts.success = jest.fn();
      Alerts.error = jest.fn();
    });

    it('should display message when successful.', async () => {
      const testProps = {
        ...props,
        history: { push: jest.fn() }
      };
      const wrapper = shallow(<Instantiation {...testProps} />);

      // Simulate a message being sent
      var message = {
        action: 'Start process',
        message: 'success',
        dataFromSuccess: {
          caseId: 300
        }
      };

      window.postMessage(message, '*');
      //New to add this Promise to allows message to be read
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(Alerts.success).toHaveBeenCalledWith(
        'The case {{caseId}} has been started successfully.'
      );
      expect(Alerts.error).not.toHaveBeenCalled();
    });

    it('should display error for failures.', async () => {
      const testProps = {
        ...props,
        history: { push: jest.fn() }
      };
      const wrapper = shallow(<Instantiation {...testProps} />);

      // Simulate a message being sent
      var message = {
        action: 'Start process',
        message: 'failed'
      };

      window.postMessage(message, '*');
      //New to add this Promise to allows message to be read
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(Alerts.success).not.toHaveBeenCalled();
      expect(Alerts.error).toHaveBeenCalledWith(
        'Error while starting the case.'
      );
    });
  });
});
