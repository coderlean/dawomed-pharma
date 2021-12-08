import React from 'react';
import buttonStyle from "./styles/styles.module.css"

const Button = ({ label, onClick, type, theme }) => {
    const handleClick = () => {
        onClick && onClick()
    }

    const getTheme = () => {
        switch (theme) {
            case "solid":
                return buttonStyle.solid;
            case "outline":
                return buttonStyle.outline;
            default:
                return buttonStyle.solid;
        }
    }

    return (
        <>
            <button className={getTheme()} type={type} onClick={() => handleClick()}>{label}</button>
        </>
    )
}

export default Button;