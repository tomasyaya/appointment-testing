import React from "react";

const data = {
  customer: { firstName: "tomas", lastName: "yaya", phone: "722 76 75 01" },
  styelist: "Jay Spears",
  startsAt: "20-20-2020",
  service: "cut",
  notes: ""
};

const Appointment = ({ customer }) => <div>{customer.firstName}</div>;

export default Appointment;
