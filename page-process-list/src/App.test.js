import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ProcessApi } from './api';

describe('React App', () => {
  const spyFetchPage = jest.spyOn(ProcessApi, 'fetchPage');

  beforeEach(() => {
    spyFetchPage.mockReset();
    spyFetchPage.mockRestore();
  });


  it('renders without crashing', () => {
    const spyFetchPage = jest.spyOn(ProcessApi, 'fetchPage');
    spyFetchPage.mockImplementation(() => Promise.resolve());

    const div = document.createElement('div');
    ReactDOM.render(<App/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});