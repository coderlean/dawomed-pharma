import React from 'react';
import buttonStyle from "./styles/styles.module.css"

const Button = ({ label, onClick, type, theme, buttonIntent, leftIcon, disabled }) => {
    
    const handleClick = () => {
        if (onClick) {
            onClick()
        }
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
            <button className={getTheme()} type={type} disabled={disabled} onClick={(e) => handleClick(e)}>
                {
                    leftIcon && leftIcon
                }

                {
                    (
                        buttonIntent === "download" && <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4.66675 6.6665L8.00008 9.99984L11.3334 6.6665" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 10V2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )
                }
                {
                    (buttonIntent === "previous" && theme === "outline") && <svg width="19" height="12" viewBox="0 0 19 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="16.2635" width="2.5465" height="23" rx="1.27325" transform="rotate(45 16.2635 0)" fill="#1D1272"/>
                    <rect y="16.5355" width="2.55" height="23" rx="1.275" transform="rotate(-45 0 16.5355)" fill="#1D1272"/>
                    </svg>
                }

                {
                    (buttonIntent === "previous" && theme === "solid") && <svg width="19" height="12" viewBox="0 0 19 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="16.2635" width="2.5465" height="23" rx="1.27325" transform="rotate(45 16.2635 0)" fill="white"/>
                    <rect y="16.5355" width="2.55" height="23" rx="1.275" transform="rotate(-45 0 16.5355)" fill="white"/>
                    </svg>
                }

                {label}

                {
                    (buttonIntent === "next" && theme === "solid") && <svg width="19" height="12" viewBox="0 0 19 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2.53555" y="32.799" width="2.5465" height="23" rx="1.27325" transform="rotate(-135 2.53555 32.799)" fill="white"/>
                    <rect x="18.799" y="16.2635" width="2.55" height="23" rx="1.275" transform="rotate(135 18.799 16.2635)" fill="white"/>
                    </svg>
                }

                {
                    (buttonIntent === "next" && theme === "outline") && <svg width="19" height="12" viewBox="0 0 19 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2.53555" y="32.799" width="2.5465" height="23" rx="1.27325" transform="rotate(-135 2.53555 32.799)" fill="#1D1272"/>
                    <rect x="18.799" y="16.2635" width="2.55" height="23" rx="1.275" transform="rotate(135 18.799 16.2635)" fill="#1D1272"/>
                    </svg>
                }

                

                
                
                </button>
        </>
    )
}

export default Button;