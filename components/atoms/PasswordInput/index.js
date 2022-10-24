import { useState } from "react";
import passwordInputStyles from "./styles/styles.module.css";

const PasswordInput = ({ placeholder, name, onChange, type }) => {
    const [inputType, setInputType] = useState("password");
  const handleChange = (event) => {
    if (onChange !== undefined && onChange !== null) {
      onChange(event.target.value);
    }
  };

  const toggleInputType = () => {
      if (inputType === "password") {
          setInputType("text");
      } else {
            setInputType("password");
        }
  }

  return (
    <div className={passwordInputStyles.passwordInputContainer}>
      <input
        id="textInput"
        type={inputType}
        name={name}
        className={passwordInputStyles.passwordInput}
        placeholder={placeholder}
        onChange={(event) => {
          handleChange(event);
        }}
      />

      <div onClick={toggleInputType}>
        {
            inputType === "text" ? <svg
            width="18"
            height="14"
            viewBox="0 0 18 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
            d="M0.75 7C0.75 7 3.75 1 9 1C14.25 1 17.25 7 17.25 7C17.25 7 14.25 13 9 13C3.75 13 0.75 7 0.75 7Z"
            stroke="#1D1272"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            />
            <path
            d="M9 9.25C10.2427 9.25 11.25 8.24268 11.25 7C11.25 5.75732 10.2427 4.75 9 4.75C7.75732 4.75 6.75 5.75732 6.75 7C6.75 8.24268 7.75732 9.25 9 9.25Z"
            stroke="#1D1272"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            />
        </svg> : <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.75 7C0.75 7 3.75 1 9 1C14.25 1 17.25 7 17.25 7C17.25 7 14.25 13 9 13C3.75 13 0.75 7 0.75 7Z" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M9 9.25C10.2427 9.25 11.25 8.24268 11.25 7C11.25 5.75732 10.2427 4.75 9 4.75C7.75732 4.75 6.75 5.75732 6.75 7C6.75 8.24268 7.75732 9.25 9 9.25Z" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

        }
      </div>
    </div>
  );
};

export default PasswordInput;
