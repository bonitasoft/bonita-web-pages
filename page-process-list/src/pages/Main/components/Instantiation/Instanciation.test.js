import React from 'react';

import Instantiation from './Instantiation';
import { shallow } from 'enzyme';

describe('Instantiation page', () => {
  const props = {
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

  it('should display instantiation form', () => {
    const wrapper = shallow(<Instantiation {...props} />);

    expect(wrapper.find('iframe').prop('src')).toEqual(
      '../../../../process/My process name/1.0/content/?id=1&autoInstantiate=false'
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
});
