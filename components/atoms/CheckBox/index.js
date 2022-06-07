import React, { useState } from "react";
import checkBoxStyle from "./styles/styles.module.css"

const CheckBox = ({ children }) => {
  const [checked, setChecked] = useState(true);

  const toggleChecked = () => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };

  return (
    <div onClick={() => toggleChecked()} className={checkBoxStyle.checkbox}>
      {checked ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="20" height="20" rx="5" fill="#1D1272" />
          <path
            d="M9.25 14.25C8.9375 14.25 8.625 14.125 8.375 13.875L5.875 11.375C5.375 10.875 5.375 10.125 5.875 9.625C6.375 9.125 7.1875 9.125 7.625 9.625L9.25 11.25L13.375 7.125C13.875 6.625 14.625 6.625 15.125 7.125C15.625 7.625 15.625 8.375 15.125 8.875L10.125 13.875C9.875 14.125 9.5625 14.25 9.25 14.25Z"
            fill="white"
          />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1"
            y="1"
            width="18"
            height="18"
            rx="4"
            stroke="#1D1272"
            strokeWidth="2"
          />
        </svg>
      )}

      {children}

      <input type="checkbox" checked={checked} style={{display: "none"}} />
    </div>
  );
};

export default CheckBox;
