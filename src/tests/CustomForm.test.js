import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { createContainer } from "./domManipulators.test";
import { CustomForm } from "../components/CutomForm";

describe("Custom form", () => {
  let render, container;

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

  const itSavesExistingValueWhenSubmited = (customerName, formId) => {
    it("saves existing value when submited", async () => {
      expect.hasAssertions();
      render(
        <CustomForm
          firstName="Ashley"
          onSubmit={({ firstName }) => {
            expect(firstName).toEqual("Ashley");
          }}
        />
      );
      await ReactTestUtils.Simulate.submit(form("customer"));
    });
  };

  const itSavesNewValueWhenSubmited = (fieldName, formId, value) => {
    it("saves new value when submited", async () => {
      expect.hasAssertions();
      render(
        <CustomForm
          {...[fieldName]}
          onSubmit={fields => {
            expect(fields[fieldName]).toEqual(value);
          }}
        />
      );
      await ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: value, name: fieldName }
      });
      await ReactTestUtils.Simulate.submit(form(formId));
    });
  };

  const itHasASubmitButton = () => {
    it("has a submit button", () => {
      render(<CustomForm />);
      const submitButton = container.querySelector('input[type="submit"]');
      expect(submitButton).not.toBeNull();
    });
  };

  describe("first name field", () => {
    // itRendersATextBox("firstName");
    // itIncludesTheExistingValue("firstName");
    // itRendersALabel("firstName", "First name");
    // itAssignsAnIdThatMatchesTheLabelId("firstName");
    // itSavesExistingValueWhenSubmited("Ashley", "customer");
    // itSavesNewValueWhenSubmited("firstName", "customer", "Jamie");
  });

  describe("last name field", () => {
    // itRendersATextBox("lastName");
    // itIncludesTheExistingValue("lastName");
    // itRendersALabel("lastName", "Last name");
    // itAssignsAnIdThatMatchesTheLabelId("lastName");
    // itSavesExistingValueWhenSubmited("Ashley", "customer");
    // itSavesNewValueWhenSubmited("lastName", "customer", "Jamie");
  });

  describe("last phone field", () => {
    // itRendersATextBox("phoneNumber");
    // itIncludesTheExistingValue("phoneNumber");
    // itRendersALabel("phoneNumber", "Phone number");
    // itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
    // itSavesExistingValueWhenSubmited("Ashley", "customer");
    // itSavesNewValueWhenSubmited("phoneNumber", "customer", "048543");
  });

  describe("submit button", () => {
    // itHasASubmitButton();
  });
});
