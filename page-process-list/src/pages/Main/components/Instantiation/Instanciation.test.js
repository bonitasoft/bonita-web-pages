import React from 'react';

import Instantiation from './Instantiation';
import {shallow} from 'enzyme';

describe('Instantiation page', () => {

    const props = {
        match: {
            params: {
                processName: 'My process name',
                processVersion: '1.0'
            }
        },
        location: {
            search: '?id=1&autoInstantiate=false'
        },

    };

    it('should display instantiation form', () => {
        const wrapper = shallow(<Instantiation {...props} />);

        expect(wrapper.find('iframe').prop('src')).toEqual(
            '../../../../process/My process name/1.0/content/?id=1&autoInstantiate=false'
        );
    });

    it('should redirect to home page after submit', () => {
        global.document.addEventListener = jest.fn();
        const wrapper = shallow(<Instantiation {...props} />);
        expect(global.document.addEventListener).toHaveBeenCalled();


       /* // Simulate a message being sent
        var event = {
            data:
                {
                    action: 'Start process',
                    message: 'success'
                }
        };
        window._listeners.message.false[0](event);

        expect('window').toEqual('SomePseudoRandomAuthenticationKey');*/
    });
});
