import React, { useEffect, useState } from 'react';
import { useRef } from 'react/cjs/react.development';
import dropDownStyle from "./styles/styles.module.css"

const DropDown = ({placeholder, defaultValue, options, name}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("")

    const dropdownRef = useRef(null)

    const handleClick = () => {
        if (isOpen){
            setIsOpen(false)
        } else {
            setIsOpen(true)
        }
    }

    const handleSelected = item => {
        setSelectedOption(item)
    }

    useEffect(() => {
        if (defaultValue && defaultValue !=="") {
            setSelectedOption(defaultValue)
        }
    }, [])

    return (
        <div className={dropDownStyle.dropdown} onClick={() => handleClick()}>
            {/* <div className={dropDownStyle.selectedBox}>
                <p>{selectedOption !== "" ? selectedOption : placeholder}</p>
                {
                    isOpen ? <svg width="12" height="12" viewBox="0 0 33 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="32.799" y="16.2635" width="5" height="23" rx="2.5" transform="rotate(135 32.799 16.2635)" fill="#444444"/>
                    <rect x="16.2635" y="3.05176e-05" width="5" height="23" rx="2.5" transform="rotate(45 16.2635 3.05176e-05)" fill="#444444"/>
                    </svg> : 
                    <svg width="12" height="12" viewBox="0 0 33 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect y="3.53552" width="5" height="23" rx="2.5" transform="rotate(-45 0 3.53552)" fill="#444444"/>
                    <rect x="16.5355" y="19.799" width="5" height="23" rx="2.5" transform="rotate(-135 16.5355 19.799)" fill="#444444"/>
                    </svg>
                }
            </div> */}

            <select name={name} className={dropDownStyle.select} defaultValue={defaultValue ? defaultValue  : ""}>
                {
                    options.map((item, index) => <option key={index}>{item}</option>)
                }
            </select>

            {/* {
                isOpen &&
                <div className={dropDownStyle.selectBox}>
                {
                    options.map((item, index) => <p key={index} onClick={() => {
                        handleSelected(item)
                    }}>{item}</p>)
                }
            </div>
            } */}
        </div>
    )
}

export default DropDown;