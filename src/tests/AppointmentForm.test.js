import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { createContainer } from "./domManipulators.test";
import { AppointmentForm } from "../components/AppointmentForm";

describe("Appointment form", () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = id => container.querySelector(`form[id=${id}]`);
  const field = name => form("appointment").elements[name];
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);
  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find(option => option.textContent === textContent);
  };

  const itRendersAForm = () => {
    it("renders a form", () => {
      render(<AppointmentForm />);
      expect(form("appointment")).not.toBeNull();
    });
  };

  itRendersAForm();

  const itRendersSelectBox = () => {
    it("renders a select box", () => {
      render(<AppointmentForm />);
      expect(field("service")).not.toBeNull();
      expect(field("service").tagName).toEqual("SELECT");
    });
  };

  const itInitiallyHasEmptyValue = value => {
    it("initially has a blank value chosen", () => {
      render(<AppointmentForm />);
      const firstNode = field("service").childNodes[0];
      expect(firstNode.value).toEqual(value);
      expect(firstNode.selected).toBeTruthy();
    });
  };

  const itListAllServices = () => {
    it("list all salon services", () => {
      const selectableServices = ["Cut", "Blow-dry"];
      render(<AppointmentForm selectableServices={selectableServices} />);
      const optionNodes = Array.from(field("service").childNodes);
      const renderedServices = optionNodes.map(node => node.textContent);
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });
  };

  const itPreSelectExistingValue = () => {
    it("pre-select the existing value", () => {
      const services = ["Cut", "Blow-dry"];
      render(
        <AppointmentForm service="Blow-dry" selectableServices={services} />
      );
      const option = findOption(field("service"), "Blow-dry");
      expect(option.selected).toBeTruthy();
    });
  };

  const itRendersALabel = label => {
    it("renders a label", () => {
      render(<AppointmentForm />);
      expect(labelFor(label)).not.toBeNull();
    });
  };

  const itAssignsIdThatMatchesLabel = label => {
    it("assigns an id that matches the label", () => {
      render(<AppointmentForm />);
      expect(field("service").id).toEqual(label);
    });
  };

  const itSavesExistingValueWhenSubmited = (formId, defaultValue) => {
    it("saves existing value when submited", async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          defaultValue={defaultValue}
          onSubmit={value => {
            expect(value).toEqual(defaultValue);
          }}
        />
      );

      await ReactTestUtils.Simulate.submit(form(formId));
    });
  };

  const itSavesNewValueWhenSubmited = (formId, fieldName, newService) => {
    it("saves new value when submited", async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          onSubmit={service => {
            expect(service).toEqual(newService);
          }}
        />
      );
      await ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: newService }
      });
      await ReactTestUtils.Simulate.submit(form(formId));
    });
  };

  describe("service field", () => {
    itRendersAForm();
    itRendersSelectBox();
    itInitiallyHasEmptyValue("");
    itListAllServices();
    itPreSelectExistingValue();
    itRendersALabel("service");
    itAssignsIdThatMatchesLabel("service");
    itSavesExistingValueWhenSubmited("appointment", "cut");
    itSavesNewValueWhenSubmited("appointment", "service", "beard trim");
  });
});
