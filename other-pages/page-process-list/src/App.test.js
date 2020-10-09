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
import App from './App';
import { shallow } from 'enzyme';
import { HashRouter } from 'react-router-dom';

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
