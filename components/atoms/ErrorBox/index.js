import { iconsSVGs } from "../../../assets/images/icons"
import Styles from "./styles/styles.module.css"

const ErrorBox = ({errorMessage, closeErrorBox, hideClose}) => {
    return (
        <div className={[Styles.errorMessage, "displayFlex jcSpaceBetween alignCenter"].join(" ")}>
                <p style={{color: "white"}}>{errorMessage}</p>

                {
                    !hideClose && <div onClick={() => closeErrorBox()}>
                    {
                        iconsSVGs.closeIconWhite
                    }
                </div>
                }
        </div>
    )
}

export default ErrorBox