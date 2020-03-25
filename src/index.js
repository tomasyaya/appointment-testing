import React from "react";
import ReactDOM from "react-dom";
import { AppointmentsDayView } from "./components/AppointmentsDayView";
import { CustomForm } from "./components/CutomForm";
import { sampleAppointments } from "./sampleData";
import "whatwg-fetch";

ReactDOM.render(<CustomForm />, document.getElementById("root"));
