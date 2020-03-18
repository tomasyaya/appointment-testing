import React, { useState } from "react";

const data = {
  customer: { firstName: "tomas", lastName: "yaya", phone: "722 76 75 01" },
  styelist: "Jay Spears",
  startsAt: "20-20-2020",
  service: "cut",
  notes: ""
};

function appointmentTimeOfDay(startsAt) {
  const [h, m] = new Date(startsAt).toTimeString().split(":");
  return `${h}:${m}`;
}

export const Appointment = ({
  customer,
  service,
  stylist,
  notes,
  startsAt
}) => (
  <div id="appointmentView">
    <h3>Today&rsquo;s appointment at {appointmentTimeOfDay(startsAt)}</h3>
    <table>
      <tbody>
        <tr>
          <td>Customer</td>
          <td>
            {customer.firstName} {customer.lastName}
          </td>
        </tr>
        <tr>
          <td>Phone number</td>
          <td>{customer.phoneNumber}</td>
        </tr>
        <tr>
          <td>Stylist</td>
          <td>{stylist}</td>
        </tr>
        <tr>
          <td>Service</td>
          <td>{service}</td>
        </tr>
        <tr>
          <td>Notes</td>
          <td>{notes}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export const AppointmentsDayView = ({ appointments = [] }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(0);
  const list = appointments.map((app, i) => (
    <li key={app.startsAt}>
      <button type="button" onClick={() => setSelectedAppointment(i)}>
        {appointmentTimeOfDay(app.startsAt)}
      </button>
    </li>
  ));
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
