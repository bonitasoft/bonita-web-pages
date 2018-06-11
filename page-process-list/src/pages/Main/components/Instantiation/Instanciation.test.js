import React from "react";

import Instantiation from "./Instantiation";
import { shallow } from "enzyme";

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

  it("should add an event listenenr when component is created", () => {
    window.addEventListener = jest.fn();
    const wrapper = shallow(<Instantiation {...props} />);

    expect(window.addEventListener).toHaveBeenCalled();
  });

  it("should redirect to home page after submit", () => {
    const testProps = {
      ...{
        history: { push: jest.fn() }
      },
      ...props
    };
    const wrapper = shallow(<Instantiation {...testProps} />);
    let event = {
      data: {
        action: "Start process",
        message: "success"
      }
    };

    wrapper.instance().onFormSubmited(event);

    expect(testProps.history.push).toHaveBeenCalledWith("/");
  });
});
