import React, { useRef } from "react";
import datePickerStyles from "./styles/styles.module.css";

const DatePicker = ({name, defaultValue}) => {
    const inputRef = useRef(null);
  return (
    <div className={datePickerStyles.datePicker}>


        <input defaultValue={defaultValue ? defaultValue : ""} type="date" id="datepicker" name={name} ref={inputRef} placeholder="Select a date" />

    </div>
  );
};

export default DatePicker;
