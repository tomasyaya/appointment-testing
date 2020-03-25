import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from "react-dom/test-utils";
import {
  AppointmentsDayView,
  Appointment
} from "../components/AppointmentsDayView";

describe("Appointment", () => {
  let container;
  let customer;
  const render = component => ReactDOM.render(component, container);
  beforeEach(() => {
    container = document.createElement("div");
  });
  it("render the customer first name", () => {
    customer = { firstName: "tomas" };
    render(<Appointment customer={customer} />, container);
    expect(container.textContent).toMatch("tomas");
  });
  it("render another customer", () => {
    customer = { firstName: "jordan" };
    render(<Appointment customer={customer} />, container);
    expect(container.textContent).toMatch("jordan");
  });
});

describe("AppointmentDayView", () => {
  let container;
  const today = new Date();
  const appointments = [
    { startsAt: today.setHours(12, 0), customer: { firstName: "Ashley" } },
    { startsAt: today.setHours(13, 0), customer: { firstName: "Jordan" } }
  ];
  const render = component => ReactDOM.render(component, container);
  beforeEach(() => {
    container = document.createElement("div");
  });
  it("renders a div with the right ID", () => {
    render(<AppointmentsDayView appointments={[]} />, container);
    expect(container.querySelector("div#appointmentsDayView")).not.toBeNull();
  });
  it("initially shows a message if there is no appointments", () => {
    render(<AppointmentsDayView appointments={[]} />, container);
    expect(container.textContent).toMatch(
      "There are no appointments schedule for today"
    );
  });
  it("it selects the first appointment by default", () => {
    render(<AppointmentsDayView appointments={appointments} />, container);
    expect(container.textContent).toMatch("Ashley");
  });
  it("has a button element in each li", () => {
    render(<AppointmentsDayView appointments={appointments} />, container);
    expect(container.querySelectorAll("li > button")).toHaveLength(2);
    expect(container.querySelectorAll("li > button")[0].type).toEqual("button");
  });
  it("renders another appointment when selected", () => {
    render(<AppointmentsDayView appointments={appointments} />, container);
    const button = container.querySelectorAll("li > button")[1];
    ReactTestUtils.Simulate.click(button);
    expect(container.textContent).toMatch("Jordan");
  });
  it("renders multiple appointments in an ol element", () => {
    render(<AppointmentsDayView appointments={appointments} />, container);
    expect(container.querySelector("ol").children).toHaveLength(2);
  });
  it("renders multiple appointments in an li", () => {
    render(<AppointmentsDayView appointments={appointments} />, container);
    expect(container.querySelectorAll("li")).toHaveLength(2);
    expect(container.querySelectorAll("li")[0].textContent).toEqual("12:00");
    expect(container.querySelectorAll("li")[1].textContent).toEqual("13:00");
  });
});
