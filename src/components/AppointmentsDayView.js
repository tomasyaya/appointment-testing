import React, { useState } from "react";

const data = {
  customer: { firstName: "tomas", lastName: "yaya", phone: "722 76 75 01" },
  styelist: "Jay Spears",
  startsAt: "20-20-2020",
  service: "cut",
  notes: ""
};

function normalizeDate(startsAt) {
  const [h, m] = new Date(startsAt).toTimeString().split(":");
  return `${h}:${m}`;
}

const Appointment = ({ customer }) => <div>{customer.firstName}</div>;

export const AppointmentsDayView = ({ appointments = [] }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(0);
  const list = appointments.map((app, i) => (
    <li key={app.startsAt}>
      <button type="button" onClick={() => setSelectedAppointment(i)}>
        {normalizeDate(app.startsAt)}
      </button>
    </li>
  ));
  const op = { name: "tomas" };
  const two = { ...op };
  return (
    <div id="appointmentsDayView">
      <ol>{list}</ol>
      {appointments.length && (
        <Appointment {...appointments[selectedAppointment]} />
      )}
      <p>There are no appointments schedule for today</p>
    </div>
  );
};
