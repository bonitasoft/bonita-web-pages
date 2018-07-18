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
      8910: { message: 'a warning', severity: 'warning' }
    };

    wrapper.setState({ alerts });

    expect(
      wrapper
        .find('Alert')
        .at(0)
        .props()
    ).toMatchObject({ message: 'an error', severity: 'error' });
    expect(
      wrapper
        .find('Alert')
        .at(1)
        .props()
    ).toMatchObject({ message: 'a success', severity: 'success' });
    expect(
      wrapper
        .find('Alert')
        .at(2)
        .props()
    ).toMatchObject({ message: 'a warning', severity: 'warning' });
  });

  it('should synchronize its state with alert service', () => {
    const wrapper = shallow(<Alerts />);

    Alerts.warning('a warning');
    Alerts.success('a success');
    Alerts.error('an error');

    const alertsInState = Object.values(wrapper.state().alerts);
    expect(alertsInState).toContainEqual({
      message: 'a warning',
      severity: 'warning'
    });
    expect(alertsInState).toContainEqual({
      message: 'a success',
      severity: 'success'
    });
    expect(alertsInState).toContainEqual({
      message: 'an error',
      severity: 'danger'
    });
  });

  it('should close an alert', () => {
    jest.useFakeTimers();
    const alerts = {
      1234: { message: 'an error', severity: 'error' }
    };
    alertService.close = jest.fn();
    const wrapper = shallow(<Alerts />);
    wrapper.setState({ alerts });

    wrapper.find('Alert').prop('onClose')();
    jest.runAllTimers();

    expect(alertService.close).toHaveBeenCalledWith('1234');
  });
});
