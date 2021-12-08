import Head from "next/head"
import Button from "../../components/atoms/Button"
import CheckBox from "../../components/atoms/CheckBox"
import DropDown from "../../components/atoms/DropDown"
import TextInput from "../../components/atoms/textInput"
import LabeledTextInput from "../../components/molecules/LabeledTextInput"
import componentStyles from "./styles/styles.module.css"

const Components = () => {
    const options = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    return (
        <div className={componentStyles.components}>
            <Head>
                <title>Components</title>
            </Head>
            <TextInput placeholder="Placeholder" onChange={text => console.log(text)} />

            <hr />

            <Button label="Label" onClick={(data) => console.log("Clicked")} theme="solid" />

            <hr />

            <LabeledTextInput>
            <TextInput placeholder="Placeholder" onChange={text => console.log(text)} />
            </LabeledTextInput>

            <hr />

            <CheckBox>
                <label>CheckBox</label>
            </CheckBox>

            <hr />

            <DropDown placeholder="Select an option" defaultValue="Default" options={options} />
        </div>
    )
}

export default Components