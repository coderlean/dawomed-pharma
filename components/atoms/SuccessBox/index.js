import { iconsSVGs } from "../../../assets/images/icons"
import Styles from "./styles/styles.module.css"

const SuccessBox = ({successMessage, closeSuccessBox, noClose}) => {
    return (
        <div className={[Styles.successMessage, "displayFlex jcSpaceBetween alignCenter"].join(" ")}>
                <p style={{color: "white"}}>{successMessage}</p>

                {
                    !noClose && <div onClick={() => closeSuccessBox()}>
                    {
                        iconsSVGs.closeIconWhite
                    }
                </div>
                }
        </div>
    )
}

export default SuccessBox