import Styles from "./styles/styles.module.css"

const PostSignUp = ({currentPharmacyDetails}) => {
    return (
        <div className={Styles.post_sign_up}>
            <h1>Confirm Your Email</h1>
            <p>{`A confirmation email has been sent to ${currentPharmacyDetails.email}.`}</p>
        </div>
    )
}

export default PostSignUp