import React from 'react';
import Instantiation from '.';
import router from '../../routerInstance';

import { shallow } from 'enzyme';

describe.skip('Instantiation', () => {
  describe('getInstantiationUrl', () => {
    iit('should display instantiation form', () => {
      router.changePage('instantiation', {
        process: { name: 'Pool 1', version: '1.0', id: '8405256385576796210' }
      });
      //workaround jsdom issue onHashChange event
      window.onhashchange();
      const wrapper = shallow(<Instantiation />);

      expect(wrapper.find('.Instantiation')).toHaveLength(1);
      expect(
        wrapper.find({
          src:
            'http://localhost/portal/resource/process/Pool%201/1.0/content/?id=8405256385576796210'
        })
      ).toHaveLength(1);
    });
  });
});
