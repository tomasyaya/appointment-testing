import React from "react";
import { useState } from "react";
import { Error } from "./Error";

export const CustomForm = ({ firstName, lastName, phoneNumber, onSave }) => {
  const [customer, setCustomer] = useState({ firstName });
  const [error, setError] = useState(false);
  const handleChange = ({ target }) => {
    setCustomer(customer => ({
      ...customer,
      [target.name]: target.value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const result = await window.fetch("/customers", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer)
    });
    if (result.ok) {
      const customerWithId = await result.json();
      onSave(customerWithId);
      return;
    }
    setError(true);
  };
  return (
    <form id="customer" onSubmit={handleSubmit}>
      {error ? <Error /> : null}
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

CustomForm.defaultProps = {
  onSave: () => {}
};
