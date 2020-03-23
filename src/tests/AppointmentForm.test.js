import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { createContainer } from "./domManipulators";
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
    // itRendersAForm();
    // itRendersSelectBox();
    // itInitiallyHasEmptyValue("");
    // itListAllServices();
    // itPreSelectExistingValue();
    // itRendersALabel("service");
    // itAssignsIdThatMatchesLabel("service");
    // itSavesExistingValueWhenSubmited("appointment", "cut");
    // itSavesNewValueWhenSubmited("appointment", "service", "beard trim");
  });

  const timeSlotTable = () => container.querySelector("table#time-slots");
  const startsAtField = index =>
    container.querySelectorAll('input[name="startsAt"]')[index];

  const itRendersATableForTimeSlots = () => {
    it("renders a table for time slots", () => {
      render(<AppointmentForm />);
      expect(timeSlotTable()).not.toBeNull();
    });
  };

  const itRendersTimeSlotForEveryHalfHour = () => {
    it("renders a time slot for every half an hour between the open a closing hours", () => {
      render(<AppointmentForm salonOpensAt={9} salonClosesAt={11} />);
      const timesOfDay = timeSlotTable().querySelectorAll("tbody >* th");
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual("09:00");
      expect(timesOfDay[1].textContent).toEqual("09:30");
      expect(timesOfDay[3].textContent).toEqual("10:30");
    });
  };

  const itRendersAnEmptyCellAtTheStart = () => {
    it("renders an empty cell at the start of the header row", () => {
      render(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector("thead > tr");
      expect(headerRow.firstChild.textContent).toEqual("");
    });
  };

  const itRendersAWeekOfAvailableDays = () => {
    it("renders a week of available days", () => {
      const today = new Date(2018, 11, 1);
      render(<AppointmentForm today={today} />);
      const dates = timeSlotTable().querySelectorAll(
        "thead >* th:not(:first-child)"
      );
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual("Sat 01");
      expect(dates[1].textContent).toEqual("Sun 02");
      expect(dates[6].textContent).toEqual("Fri 07");
    });
  };

  const itRendersARadioButtonForSlot = () => {
    it("renders a radio button for each time slot", () => {
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) }
      ];
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );
      const cells = timeSlotTable().querySelectorAll("td");
      expect(cells[0].querySelector('input[type="radio"]')).not.toBeNull();
      expect(cells[7].querySelector('input[type="radio"]')).not.toBeNull();
    });
  };

  const itRenderNoRadioButtons = () => {
    it("renders no radio button for unavailable time slots", () => {
      render(<AppointmentForm availableTimeSlots={[]} />);
      const timesOfDay = timeSlotTable().querySelectorAll("input");
      expect(timesOfDay).toHaveLength(0);
    });
  };

  const itSetsRadioButtonValuesToAppointments = () => {
    it("sets radio button values to the index of the corresponding appointment", () => {
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) }
      ];
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );
      expect(startsAtField(0).value).toEqual(
        availableTimeSlots[0].startsAt.toString()
      );
      expect(startsAtField(0).value).toEqual(
        availableTimeSlots[0].startsAt.toString()
      );
    });
  };

  const itSavesNewValueWhenSubmitted = () => {
    it("saves new value when submitted", async () => {
      expect.hasAssertions();
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) }
      ];
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          startsAt={availableTimeSlots[0].startsAt}
          today={today}
          onSubmit={({ startsAt }) => {
            expect(startsAt).toEqual(availableTimeSlots[1].startsAt);
            expect(startsAtField(0).checked).toEqual(false);
          }}
        />
      );
      ReactTestUtils.Simulate.change(startsAtField(1), {
        target: {
          value: availableTimeSlots[1].startsAt.toString(),
          name: "startsAt"
        }
      });
      ReactTestUtils.Simulate.submit(form("appointment"));
    });
  };

  describe("time slot table", () => {
    // itRendersATableForTimeSlots("table#time-slots");
    // itRendersTimeSlotForEveryHalfHour();
    // itRendersAnEmptyCellAtTheStart();
    // itRendersAWeekOfAvailableDays();
    itRendersARadioButtonForSlot();
    itRenderNoRadioButtons();
    itSetsRadioButtonValuesToAppointments();
    itSavesNewValueWhenSubmitted();
  });
});
