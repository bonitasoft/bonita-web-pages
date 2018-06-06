import React from 'react';

import Instantiation from './Instantiation';
import { shallow } from 'enzyme';

describe('Instantiation page', () => {
  it('should display instantiation form', () => {
    const props = {
      match: {
        params: {
          processName: 'My process name',
          processVersion: '1.0'
        }
      }
    };

    const wrapper = shallow(<Instantiation {...props} />);

    expect(wrapper.find('iframe').prop('src')).toEqual(
      '../../../../process/My process name/1.0/content/'
    );
  });
});
