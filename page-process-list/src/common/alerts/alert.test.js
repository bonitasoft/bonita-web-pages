import { shallow } from 'enzyme';
import Alert from './alert';
import React from 'react';

describe('Alert', () => {
  it('should display an error alert', () => {
    const wrapper = shallow(
      <Alert message={'There was an error'} severity={'error'} />
    );

    expect(wrapper.find('p').text()).toBe('There was an error');
    expect(wrapper.find('.Alert').hasClass('is-error')).toBe(true);
  });

  it('should display a success alert', () => {
    const wrapper = shallow(
      <Alert message={'That works !'} severity={'success'} />
    );

    expect(wrapper.find('p').text()).toBe('That works !');
    expect(wrapper.find('.Alert').hasClass('is-success')).toBe(true);
  });

  it('should display a warning alert', () => {
    const wrapper = shallow(
      <Alert message={'Careful dude'} severity={'warning'} />
    );

    expect(wrapper.find('p').text()).toBe('Careful dude');
    expect(wrapper.find('.Alert').hasClass('is-warning')).toBe(true);
  });

  it('should have a button to close it', () => {
    const closeFn = jest.fn();
    const wrapper = shallow(<Alert onClose={closeFn} />);

    wrapper.find('.Alert-closeBtn').simulate('click');

    expect(wrapper.find('.Alert').hasClass('is-closed'));
    expect(closeFn).toHaveBeenCalled();
  });
});
