import React, { useState } from "react";

export const AppointmentForm = ({
  selectableServices,
  onSubmit,
  service,
  defaultValue
}) => {
  const [value, setValue] = useState(defaultValue);
  const handleChange = ({ target }) => {
    setValue(target.value);
  };
  return (
    <form id="appointment" onSubmit={() => onSubmit(value)}>
      <label htmlFor="service">Service</label>
      <select
        id="service"
        name="service"
        value={service}
        onChange={handleChange}
      >
        <option />
        {selectableServices.map(service => (
          <option key={service}>{service}</option>
        ))}
      </select>
    </form>
  );
};

AppointmentForm.defaultProps = {
  selectableServices: [
    "Cut",
    "Blow-dry",
    "Cut & Color",
    "Beard trim",
    "Cut & Beard trim",
    "Extensions"
  ]
};
