import React, { useState, useCallback } from "react";

const buildTimeArray = (arrayLength, fillValue, increment) =>
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

const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot);
  return new Date(date).setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
};

const RadioButtonsAvailable = ({
  availableTimeSlots,
  date,
  timeSlot,
  checkedTimeSlots,
  handleChange
}) => {
  const startsAt = mergeDateAndTime(date, timeSlot);
  const isChecked = startsAt === checkedTimeSlots;
  if (
    availableTimeSlots.some(
      availableTimeSlot =>
        availableTimeSlot.startsAt === mergeDateAndTime(date, timeSlot)
    )
  ) {
    return (
      <input
        type="radio"
        name="startsAt"
        value={startsAt}
        checked={isChecked}
        onChange={handleChange}
      />
    );
  }

  return null;
};

const TimeSlotTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  handleChange
}) => {
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
            {dates.map(date => {
              return (
                <td key={date}>
                  <RadioButtonsAvailable
                    availableTimeSlots={availableTimeSlots}
                    timeSlot={timeSlot}
                    date={date}
                    handleChange={handleChange}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AppointmentForm = ({
  availableTimeSlots,
  selectableServices,
  salonClosesAt,
  salonOpensAt,
  defaultValue,
  onSubmit,
  service,
  today
}) => {
  const [appointment, setAppointment] = useState(defaultValue);
  const handleChange = ({ target }) => {
    setAppointment(target.value);
  };
  const handleStartsAtChange = useCallback(
    ({ target: { value } }) =>
      setAppointment(appointment => ({
        ...appointment,
        startsAt: parseInt(value)
      })),
    []
  );
  return (
    <form id="appointment" onSubmit={() => onSubmit(appointment)}>
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
        availableTimeSlots={availableTimeSlots}
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        handleChange={handleStartsAtChange}
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
  today: new Date(),
  availableTimeSlots: []
};
