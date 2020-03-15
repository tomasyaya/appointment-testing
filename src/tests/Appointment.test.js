import React from "react";
import ReactDOM from "react-dom";
import Appointment from "../components/Appointment";

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
  beforeEach(() => {
    container = document.createElement("div");
    const render = component => ReactDOM.render(component, container);
  });
});
