import React, { useState } from "react";

export const AppointmentForm = ({
  selectableServices,
  onSubmit,
  defaultValue
}) => {
  const [value, setValue] = useState(defaultValue);
  const handleChange = ({ target }) => {
    setValue(value => ({
      ...value,
      [target.name]: target.value
    }));
  };
  return (
    <form id="appointment" onSubmit={() => onSubmit(value)}>
      <label htmlFor="service">Service</label>
      <select id="service" name="service" value={value} onChange={handleChange}>
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
