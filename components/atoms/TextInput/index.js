import textInputStyles from "./styles/styles.module.css"

const TextInput = ({placeholder, disabled, value, onChange, type, maxLength, max, name, pattern}) => {

    const handleChange = (event) => {
        if (onChange) {
            onChange(event.target.value)
        }
    }

    if (type === "textarea"){
        return (
            <div className={textInputStyles.textInputContainer}>
                <textarea disabled={disabled} name={name} defaultValue={value ? value : ""} rows={3}  id="textInput" type={type} className={textInputStyles.textInput} placeholder={placeholder} onChange={event => {
                handleChange(event)
            }}></textarea>
            </div>
        )
    } else {
        return (
            <div className={textInputStyles.textInputContainer}>
                <input disabled={disabled} name={name} defaultValue={value ? value : ""} id="textInput" type={type} className={textInputStyles.textInput} placeholder={placeholder} max={max} maxLength={maxLength} onChange={event => {
                handleChange(event)
            }} />
            </div>
        )
    }




}

export default TextInput;