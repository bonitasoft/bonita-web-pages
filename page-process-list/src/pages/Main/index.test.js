import React from 'react';
import Main from './index';

describe('Main', () => {
  const props = {
    session: {
      user_id: 1
    }
  };
  const main = new Main(props);
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
});
