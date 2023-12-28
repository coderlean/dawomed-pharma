import React, { useRef } from "react";
import datePickerStyles from "./styles/styles.module.css";

const DatePicker = ({name, defaultValue, min, minRequired}) => {
    const inputRef = useRef(null);
    console.log({min});
    function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      console.log({result: result.toISOString()});
      return String(result.toISOString()).split("T")[0];
    }
  return (
    <div className={datePickerStyles.datePicker}>


        <input defaultValue={defaultValue ? defaultValue : ""} type="date" id="datepicker" min={min && addDays(min, 1)} name={name} ref={inputRef} placeholder="Select a date" disabled={minRequired && !min} />

    </div>
  );
};

export default DatePicker;
