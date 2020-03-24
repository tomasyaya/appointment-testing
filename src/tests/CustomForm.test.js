import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { createContainer } from "./domManipulators";
import { CustomForm } from "../components/CutomForm";

describe("Custom form", () => {
  let render, container;

  const spy = () => {
    let receivedArgument;
    return {
      fn: (...args) => (receivedArgument = args),
      receivedArguments: () => receivedArgument,
      receivedArgument: n => receivedArgument[n]
    };
  };

  expect.extend({
    toHaveBeenCalled(received) {
      if (received.receivedArguments() === undefined) {
        return {
          pass: false,
          message: () => "Spy was not called"
        };
      }
      return { pass: true, message: () => "Spy was called" };
    }
  });

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = id => container.querySelector(`form[id=${id}]`);
  const field = name => form("customer").elements[name];

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual("INPUT");
    expect(formElement.type).toEqual("text");
  };

  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);

  const itRendersATextBox = fieldName => {
    it("renders as a text box", () => {
      render(<CustomForm />);
      expectToBeInputFieldOfTypeText(field(fieldName));
    });
  };

  const itIncludesTheExistingValue = fieldName => {
    it("includes the existing value ", () => {
      render(<CustomForm {...{ [fieldName]: "value" }} />);
      expect(field(fieldName).value).toEqual("value");
    });
  };

  const itRendersALabel = (fieldName, labelName) => {
    it("renders a label ", () => {
      render(<CustomForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(labelName);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = label => {
    it("assigns an id that matches the label id ", () => {
      render(<CustomForm />);
      expect(field(label).id).toEqual(label);
    });
  };

  const itSavesExistingValueWhenSubmited = fieldName => {
    it("saves existing value when submited", async () => {
      let fetchSpy = spy();
      render(<CustomForm {...{ [fieldName]: "value" }} fetch={fetchSpy.fn} />);

      ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: "value", name: fieldName }
      });
      ReactTestUtils.Simulate.submit(form("customer"));
      const fetchOpts = fetchSpy.receivedArgument(1);
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual("value");
    });
  };

  const itSavesNewValueWhenSubmited = (fieldName, formId, value) => {
    it("saves new value when submited", async () => {
      let fetchSpy = spy();
      render(
        <CustomForm
          {...{ [fieldName]: "existing-value" }}
          fetch={fetchSpy.fn}
        />
      );
      ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: value, name: fieldName }
      });
      ReactTestUtils.Simulate.submit(form(formId));
      const fetchOpts = fetchSpy.receivedArgument(1);
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(value);
    });
  };

  const itHasASubmitButton = () => {
    it("has a submit button", () => {
      render(<CustomForm />);
      const submitButton = container.querySelector('input[type="submit"]');
      expect(submitButton).not.toBeNull();
    });
  };

  const itCallsFetchWithRightProperties = () => {
    it("calls fetch with the right properties when submitting data", async () => {
      const fetchSpy = spy();
      render(<CustomForm fetch={fetchSpy.fn} onSubmit={() => {}} />);
      ReactTestUtils.Simulate.submit(form("customer"));
      expect(fetchSpy).toHaveBeenCalled();
      expect(fetchSpy.receivedArgument(0)).toEqual("/customers");
      const fetchOpts = fetchSpy.receivedArgument(1);
      expect(fetchOpts.method).toEqual("POST");
      expect(fetchOpts.credentials).toEqual("same-origin");
      expect(fetchOpts.headers).toEqual({
        "Content-Type": "application/json"
      });
    });
  };

  describe("first name field", () => {
    itRendersATextBox("firstName");
    itIncludesTheExistingValue("firstName");
    itRendersALabel("firstName", "First name");
    itAssignsAnIdThatMatchesTheLabelId("firstName");
    itSavesExistingValueWhenSubmited("firstName");
    itSavesNewValueWhenSubmited("firstName", "customer", "Jamie");
  });

  describe("last name field", () => {
    itRendersATextBox("lastName");
    itIncludesTheExistingValue("lastName");
    itRendersALabel("lastName", "Last name");
    itAssignsAnIdThatMatchesTheLabelId("lastName");
    itSavesExistingValueWhenSubmited("lastName");
    itSavesNewValueWhenSubmited("lastName", "customer", "Jamie");
  });

  describe("last phone field", () => {
    itRendersATextBox("phoneNumber");
    itIncludesTheExistingValue("phoneNumber");
    itRendersALabel("phoneNumber", "Phone number");
    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
    itSavesExistingValueWhenSubmited("phoneNumber");
    itSavesNewValueWhenSubmited("phoneNumber", "customer", "048543");
  });

  describe("submit button", () => {
    itHasASubmitButton();
    itCallsFetchWithRightProperties();
  });
});
