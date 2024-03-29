import React from 'react';
import LTIStyle from "./styles/styles.module.css"

const LabeledTextInput = ({children, label}) => {
    return (
        <div className={LTIStyle.labeledTextInput}>
            <label htmlFor="textInput">{label}</label>
            <div className={LTIStyle.separator}></div>
            {children}
        </div>
    )
}

export default LabeledTextInput;