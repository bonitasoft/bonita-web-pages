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
import { shallow } from 'enzyme';
import Alert from './alert';
import React from 'react';

describe('Alert', () => {
  it('should display an error alert', () => {
    const wrapper = shallow(
      <Alert message={'There was an error'} severity={'danger'} />
    );

    expect(wrapper.find('p').text()).toBe('There was an error');
    expect(wrapper.find('.Alert').hasClass('alert-danger')).toBe(true);
    expect(wrapper.find('Glyphicon').get(0).props.glyph).toEqual('ban-circle');
  });

  it('should display a success alert', () => {
    const wrapper = shallow(
      <Alert message={'That works !'} severity={'success'} />
    );

    expect(wrapper.find('p').text()).toBe('That works !');
    expect(wrapper.find('.Alert').hasClass('alert-success')).toBe(true);
    expect(wrapper.find('Glyphicon').get(0).props.glyph).toEqual('ok-circle');
  });

  it('should display a warning alert', () => {
    const wrapper = shallow(
      <Alert message={'Careful dude'} severity={'warning'} />
    );

    expect(wrapper.find('p').text()).toBe('Careful dude');
    expect(wrapper.find('.Alert').hasClass('alert-warning')).toBe(true);
    expect(wrapper.find('Glyphicon').get(0).props.glyph).toEqual(
      'exclamation-sign'
    );
  });

  it('should have a button to close it', () => {
    const closeFn = jest.fn();
    const wrapper = shallow(<Alert onClose={closeFn} />);

    wrapper.find('.Alert-closeBtn').simulate('click');

    expect(wrapper.find('.Alert').hasClass('is-closed'));
    expect(closeFn).toHaveBeenCalled();
  });
});
