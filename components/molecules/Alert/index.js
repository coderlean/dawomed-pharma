import React from "react";
import alertStyle from "./styles/styles.module.css";

const Alert = ({message, type}) => {
  return (
    <div className={[alertStyle.alert, type].join(" ")}>
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10.5" cy="10.5" r="9.5" stroke="white" strokeWidth="2" />
        <rect x="9" y="4" width="2" height="10" rx="1" fill="white" />
        <circle cx="10" cy="16" r="1" fill="white" />
      </svg>

      <p>{message}</p>

      <style jsx>
{
    `
    .success {
        background-color: #29BC9B;
    }

    .error {
        background-color: #e53935;
    }

    .warning {
        background-color: #ffcc00;
    }

    .info {
        background-color: #05B8CC;
    }
    `
}
      </style>
    </div>
  );
};

export default Alert;
