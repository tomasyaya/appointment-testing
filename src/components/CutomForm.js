import React from "react";
import { useState } from "react";

export const CustomForm = ({ firstName, lastName, phoneNumber, onSubmit }) => {
  const [customer, setCustomer] = useState({ firstName });
  const handleChange = ({ target }) => {
    setCustomer(customer => ({
      ...customer,
      [target.name]: target.value
    }));
  };
  return (
    <form id="customer" onSubmit={() => onSubmit(customer)}>
      <label htmlFor="firstName">First name</label>
      <input
        id="firstName"
        type="text"
        name="firstName"
        value={firstName}
        onChange={handleChange}
      />
      <label htmlFor="lastName">Last name</label>
      <input
        id="lastName"
        type="text"
        name="lastName"
        value={lastName}
        onChange={handleChange}
      />
      <label htmlFor="phoneNumber">Phone number</label>
      <input
        id="phoneNumber"
        type="text"
        name="phoneNumber"
        value={phoneNumber}
        onChange={handleChange}
      />
      <input type="submit" value="Add" />
    </form>
  );
};
