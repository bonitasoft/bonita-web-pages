import React from 'react';
import Main from './index';
import { withRouter } from 'react-router-dom';
import { shallow } from 'enzyme';

describe('Main', () => {
  const push = jest.fn();
  const props = {
    history: { push: push },
    location: {},
    session: {
      user_id: 1
    }
  };

  jest.mock('react-router-dom');
  const Component = new Main.WrappedComponent(props);
  const main = withRouter(Component);

  it('should load processes and categories on mount', () => {
    main.getProcesses = jest.fn();
    main.getCategories = jest.fn();

    main.componentDidMount();

    expect(main.getProcesses).toHaveBeenCalled();
    expect(main.getCategories).toHaveBeenCalled();
  });

  it('should format page number for bonita API', () => {
    let formatedNumber = main.formatPageNumberForBonitaAPI(2);
    expect(formatedNumber).toEqual(1);
    formatedNumber = main.formatPageNumberForBonitaAPI(0);
    expect(formatedNumber).toEqual(0);
  });

  it('should change history when process start', () => {
    main.startProcess({ version: '1.0', id: 'toto', displayName: 'MyProcess' });

    expect(push.mock.calls.length).toEqual(1);
  });
});
