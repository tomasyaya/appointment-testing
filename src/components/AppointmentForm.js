import React, { useState } from "react";

const buildDatesArray = (arrayLength, fillValue, increment) =>
  Array(arrayLength)
    .fill([fillValue])
    .reduce((acc, _, i) => acc.concat([fillValue + i * increment]));

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  const increment = 30 * 60 * 1000;
  return buildTimeArray(totalSlots, startTime, increment);
};

const weeklyDateValues = startDate => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;
  return buildTimeArray(7, midnight, increment);
};

const toTimeValue = timeStamp =>
  new Date(timeStamp).toTimeString().substring(0, 5);

const toShortDate = timeStamp => {
  const [day, , dayOfMonth] = new Date(timeStamp).toDateString().split(" ");
  return `${day} ${dayOfMonth}`;
};

const TimeSlotTable = ({ salonOpensAt, salonClosesAt, today }) => {
  const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
  const dates = weeklyDateValues(today);

  return (
    <table id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map(day => (
            <th key={day}>{toShortDate(day)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot, i) => (
          <tr key={i}>
            <th>{toTimeValue(timeSlot)}</th>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AppointmentForm = ({
  selectableServices,
  salonClosesAt,
  salonOpensAt,
  defaultValue,
  onSubmit,
  service,
  today
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
      <TimeSlotTable
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
      />
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
  ],
  salonClosesAt: 19,
  salonOpensAt: 9,
  today: new Date()
};
