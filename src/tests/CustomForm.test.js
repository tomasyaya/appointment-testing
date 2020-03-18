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

  describe("first name field", () => {
    const itRendersAsATextBox = () => {
      it("renders as a text box", () => {
        render(<CustomForm />);
        expectToBeInputFieldOfTypeText(field("firstName"));
      });
    };
    itRendersAsATextBox();
    it("includes the existing value ", () => {
      render(<CustomForm firstName="Ashley" />);
      expect(field("firstName").value).toEqual("Ashley");
    });
    it("renders a label ", () => {
      render(<CustomForm />);
      expect(labelFor("firstName")).not.toBeNull();
      expect(labelFor("firstName").textContent).toEqual("First name");
    });
    it("assigns an id that matches the label id ", () => {
      render(<CustomForm />);
      expect(field("firstName").id).toEqual("firstName");
    });
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
    it("saves new value when submited", async () => {
      expect.hasAssertions();
      render(
        <CustomForm
          firstName="Ashley"
          onSubmit={({ firstName }) => {
            expect(firstName).toEqual("Jamie");
          }}
        />
      );
      await ReactTestUtils.Simulate.change(field("firstName"), {
        target: { value: "Jamie" }
      });
      await ReactTestUtils.Simulate.submit(form("customer"));
    });
  });
});
