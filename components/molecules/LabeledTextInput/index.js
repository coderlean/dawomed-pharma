import React from 'react';
import TextInput from '../../atoms/textInput';
import LTIStyle from "./styles/styles.module.css"

const LabeledTextInput = ({children, label}) => {
    return (
        <div className={LTIStyle.labeledTextInput}>
            <label for="textInput">{label}</label>
            <div className={LTIStyle.separator}></div>
            {children}
        </div>
    )
}

export default LabeledTextInput;