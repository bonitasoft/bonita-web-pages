import React from "react";

import Instantiation from "./Instantiation";
import {shallow} from "enzyme";

describe("Instantiation page", () => {
    const props = {
        match: {
            params: {
                processName: "My process name",
                processVersion: "1.0"
            }
        },
        location: {
            search: "?id=1&autoInstantiate=false"
        }
    };

    it("should display instantiation form", () => {
        const wrapper = shallow(<Instantiation {...props} />);

        expect(wrapper.find("iframe").prop("src")).toEqual(
            "../../../../process/My process name/1.0/content/?id=1&autoInstantiate=false"
        );
    });

    it('should update history on success submit message.', async () => {
        const testProps = {
            ...props,
            history: {push: jest.fn()}
        };
        const wrapper = shallow(<Instantiation {...testProps} />);

        // Simulate a message being sent
        var message = {
                    action: 'Start process',
                    message: 'success'
                };

        window.postMessage(message, '*');
        //New to add this Promise to allows message to be read
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(testProps.history.push).toHaveBeenCalledWith("/");
    });

});
