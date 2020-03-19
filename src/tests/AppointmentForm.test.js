import React from "react";
import { createContainer } from "./domManipulators.test";
import { AppointmentForm } from "../components/AppointmentForm";

describe("Appointment form", () => {
  let render, container;
  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = id => container.querySelector(`form[id=${id}]`);

  const itRendersAForm = () => {
    it("renders a form", () => {
      render(<AppointmentForm />);
      excpect(form("appointmentForm")).not.toBeNull();
    });
  };

  itRendersAForm();
});
