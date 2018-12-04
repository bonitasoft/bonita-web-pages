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
import service from './alert-service';

const first = o => {
  const key = Object.keys(o)[0];
  const value = o[key];
  return { key, value };
};

const isEmpty = alerts => Object.keys(alerts).length === 0;

const advanceTimersByTime = time => jest.runTimersToTime(time); // should be renamed to advanceTimersByTime with jest > 22.0.0

jest.useFakeTimers();

describe('Alert service', () => {
  beforeEach(() => {
    service.alerts = {};
  });

  it('should add a warning alert', () => {
    service.warning('a warning');

    expect(first(service.alerts).key).toBeDefined();
    expect(first(service.alerts).value).toEqual({
      message: 'a warning',
      severity: 'warning'
    });
  });

  it('should execute listeners when adding a warning alert', () => {
    const listener = jest.fn();
    service.register(listener);

    service.warning('a warning');

    expect(listener).toHaveBeenCalled();
  });

  it('should close the warning alert after a 5s delay by default', () => {
    service.warning('a warning');

    advanceTimersByTime(5001);

    expect(isEmpty(service.alerts)).toBe(true);
  });

  it('should closed the warning alert after a specified delay', () => {
    service.warning('a warning', 3000);

    advanceTimersByTime(3001);

    expect(isEmpty(service.alerts)).toBe(true);
  });

  it('should never close the warning alert when infinity is specified as delay', () => {
    service.warning('a warning', Infinity);

    jest.runAllTimers();

    expect(isEmpty(service.alerts)).toBe(false);
  });

  it('should add an error alert', () => {
    service.error('an error');

    expect(first(service.alerts).key).toBeDefined();
    expect(first(service.alerts).value).toEqual({
      message: 'an error',
      severity: 'danger'
    });
  });

  it('should execute listeners when adding an error alert', () => {
    const listener = jest.fn();
    service.register(listener);

    service.error('a error');

    expect(listener).toHaveBeenCalled();
  });

  it('should close the error alert after a 5s delay by default', () => {
    service.error('an error');

    advanceTimersByTime(5001);

    expect(isEmpty(service.alerts)).toBe(true);
  });

  it('should closed the error alert after a specified delay', () => {
    service.error('an error', 3000);

    advanceTimersByTime(3001);

    expect(isEmpty(service.alerts)).toBe(true);
  });

  it('should never close the error alert when infinity is specified as delay', () => {
    service.error('an error', Infinity);

    jest.runAllTimers();

    expect(isEmpty(service.alerts)).toBe(false);
  });

  it('should add a success alert', () => {
    service.success('a success');

    expect(first(service.alerts).key).toBeDefined();
    expect(first(service.alerts).value).toEqual({
      message: 'a success',
      severity: 'success'
    });
  });

  it('should execute listeners when adding a success alert', () => {
    const listener = jest.fn();
    service.register(listener);

    service.success('a success');

    expect(listener).toHaveBeenCalled();
  });

  it('should close the success alert after a 3s delay by default', () => {
    service.success('a success');

    advanceTimersByTime(3001);

    expect(isEmpty(service.alerts)).toBe(true);
  });

  it('should closed the success alert after a specified delay', () => {
    service.success('a success', 10000);

    advanceTimersByTime(10001);

    expect(isEmpty(service.alerts)).toBe(true);
  });

  it('should never close the success alert when infinity is specified as delay', () => {
    service.success('a success', Infinity);

    jest.runAllTimers();

    expect(isEmpty(service.alerts)).toBe(false);
  });

  it('should add an info alert', () => {
    service.info('Some info');

    expect(first(service.alerts).key).toBeDefined();
    expect(first(service.alerts).value).toEqual({
      message: 'Some info',
      severity: 'info'
    });
  });

  it('should execute listeners when adding an info alert', () => {
    const listener = jest.fn();
    service.register(listener);

    service.info('Some info');

    expect(listener).toHaveBeenCalled();
  });

  it('should close the info alert after a 3s delay by default', () => {
    service.info('Some info');

    advanceTimersByTime(3001);

    expect(isEmpty(service.alerts)).toBe(true);
  });

  it('should closed the info alert after a specified delay', () => {
    service.info('Some info', 10000);

    advanceTimersByTime(10001);

    expect(isEmpty(service.alerts)).toBe(true);
  });

  it('should never close the info alert when infinity is specified as delay', () => {
    service.info('Some info', Infinity);

    jest.runAllTimers();

    expect(isEmpty(service.alerts)).toBe(false);
  });

  it('should close an alert based on its uuid', () => {
    service.success('It works');
    const uuid = first(service.alerts).key;

    service.close(uuid);

    expect(isEmpty(service.alerts)).toBe(true);
  });

  it('should execute listeners when closing an alert', () => {
    const listener = jest.fn();
    service.register(listener);

    service.close('unneeded-uuid');

    expect(listener).toHaveBeenCalled();
  });

  it('should unregister a listener', () => {
    const listener = jest.fn();
    service.register(listener);

    service.unregister(listener);

    service._executeListeners();
    expect(listener).not.toHaveBeenCalled();
  });
});
