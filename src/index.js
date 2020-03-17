import React from "react";
import ReactDOM from "react-dom";
import { AppointmentsDayView } from "./components/AppointmentsDayView";
import { sampleAppointments } from "./sampleData";

ReactDOM.render(
  <AppointmentsDayView appointments={sampleAppointments} />,
  document.getElementById("root")
);
