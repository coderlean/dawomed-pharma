import React, { useEffect, useRef, useState } from 'react';

import fileSelectorStyle from "./styles/styles.module.css"

const FileSelector = ({name, defaultFileName}) => {
    const inputRef = useRef(null)
    const [fileName, setFileName] = useState("Select a file")

    const handleClick = () => {
        console.log("Listen");
        inputRef.current.click()
    }

    useEffect(() => {
        if (defaultFileName) {
            setFileName(defaultFileName)
        }
    }, [])


    return <div className={fileSelectorStyle.fileSelector} onClick={() => {
        handleClick()
    }}>
        <label>{fileName}</label>

        <button type="button">SELECT FILE</button>

        <input name={name} type="file" id="file-selector" accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps" ref={inputRef} onChange={event => {
            if (event.target.files[0]) {
                console.log(event.target.files[0].name);
            setFileName(event.target.files[0].name)
            }
        }} />
    </div>
}

export default FileSelector;