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
import Alerts from './index';
import alertService from './alert-service';
import React from 'react';

describe('Alerts', () => {
  it('should display alerts', () => {
    const wrapper = shallow(<Alerts />);
    const alerts = {
      1234: { message: 'an error', severity: 'error' },
      4567: { message: 'a success', severity: 'success' },
      8910: { message: 'a warning', severity: 'warning' },
    };

    wrapper.setState({ alerts });

    expect(wrapper.find('Alert').at(0).props()).toMatchObject({
      message: 'an error',
      severity: 'error',
    });
    expect(wrapper.find('Alert').at(1).props()).toMatchObject({
      message: 'a success',
      severity: 'success',
    });
    expect(wrapper.find('Alert').at(2).props()).toMatchObject({
      message: 'a warning',
      severity: 'warning',
    });
  });

  it('should synchronize its state with alert service', () => {
    const wrapper = shallow(<Alerts />);

    Alerts.warning('a warning');
    Alerts.success('a success');
    Alerts.error('an error');

    const alertsInState = Object.values(wrapper.state().alerts);
    expect(alertsInState).toContainEqual({
      message: 'a warning',
      severity: 'warning',
    });
    expect(alertsInState).toContainEqual({
      message: 'a success',
      severity: 'success',
    });
    expect(alertsInState).toContainEqual({
      message: 'an error',
      severity: 'danger',
    });
  });

  it('should close an alert', () => {
    jest.useFakeTimers();
    const alerts = {
      1234: { message: 'an error', severity: 'error' },
    };
    alertService.close = jest.fn();
    const wrapper = shallow(<Alerts />);
    wrapper.setState({ alerts });

    wrapper.find('Alert').prop('onClose')();
    jest.runAllTimers();

    expect(alertService.close).toHaveBeenCalledWith('1234');
  });
});
