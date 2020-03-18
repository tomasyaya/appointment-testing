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
  const firstNameField = () => form("customer").elements.firstName;
  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual("INPUT");
    expect(formElement.type).toEqual("text");
  };
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);

  it("renders a form", () => {
    render(<CustomForm />);
    expect(form("customer")).not.toBeNull();
  });
  it("renders the first field as a text box", () => {
    render(<CustomForm />);
    expectToBeInputFieldOfTypeText(firstNameField());
  });
  it("includes the existing value of the first name", () => {
    render(<CustomForm firstName="Ashley" />);
    expect(firstNameField().value).toEqual("Ashley");
  });
  it("renders a label for the first name field", () => {
    render(<CustomForm />);
    expect(labelFor("firstName")).not.toBeNull();
    expect(labelFor("firstName").textContent).toEqual("First name");
  });
  it("assigns an id that matches the label id to the first name field", () => {
    render(<CustomForm />);
    expect(firstNameField().id).toEqual("firstName");
  });
  it("saves existing first name when submited", async () => {
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
  it("saves new first name when submited", async () => {
    expect.hasAssertions();
    render(
      <CustomForm
        firstName="Ashley"
        onSubmit={({ firstName }) => {
          expect(firstName).toEqual("Jamie");
        }}
      />
    );
    await ReactTestUtils.Simulate.change(firstNameField(), {
      target: { value: "Jamie" }
    });
    await ReactTestUtils.Simulate.submit(form("customer"));
  });
});
