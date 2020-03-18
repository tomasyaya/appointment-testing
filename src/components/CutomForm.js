import React from "react";
import { useState } from "react";

export const CustomForm = ({ firstName, onSubmit }) => {
  const [customer, setCustomer] = useState({ firstName });
  const handleChangeFirstName = ({ target }) => {
    setCustomer(customer => ({
      ...customer,
      firstName: target.value
    }));
  };
  return (
    <form id="customer" onSubmit={() => onSubmit(customer)}>
      <label htmlFor="firstName">First name</label>
      <input
        readOnly
        id="firstName"
        type="text"
        name="firstName"
        value={firstName}
        readOnly
        onChange={handleChangeFirstName}
      />
    </form>
  );
};
