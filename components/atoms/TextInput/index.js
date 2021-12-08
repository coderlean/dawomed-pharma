import textInputStyles from "./styles/styles.module.css"

const TextInput = ({placeholder, onChange}) => {
    return (
        <input id="textInput" type="text" className={textInputStyles.textInput} placeholder={placeholder} onChange={event => {
            onChange(event.target.value)
        }} />
    )
}

export default TextInput;