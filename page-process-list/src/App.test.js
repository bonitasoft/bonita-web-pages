import React from 'react';
import App from './App';
import { shallow } from 'enzyme';
import { HashRouter } from "react-router-dom";

describe('App', () => {
  it('should display main page if session is loaded', () => {
    const session = { user_id: 1 };
    const wrapper = shallow(<App session={session} />);

    expect(wrapper.find(HashRouter).exists()).toBe(true);
  });

  it('should display loader if session is not loaded', () => {
    const session = {};
    const wrapper = shallow(<App session={session} />);

    expect(wrapper.find('div.loader').exists()).toBe(true);
  });
});
