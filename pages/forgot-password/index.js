import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Button from "../../components/atoms/Button";
import CheckBox from "../../components/atoms/CheckBox";
import ErrorBox from "../../components/atoms/ErrorBox";
import PasswordInput from "../../components/atoms/PasswordInput";
import SuccessBox from "../../components/atoms/SuccessBox";
import TextInput from "../../components/atoms/TextInput";
import LabeledTextInput from "../../components/molecules/LabeledTextInput";
import { postPlain } from "../../requests/postPlain";
import loginStyles from "./styles/styles.module.css";

const ForgotPassword = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const validateEmail = submitEmailEvent => {
    submitEmailEvent.preventDefault()
    
    const email = submitEmailEvent.target[0].value

    if (!email){
      return setErrorMessage("Enter your email address to reset your password.")
    }

    setErrorMessage("")
    setSuccessMessage("")

    sendForgotPasswordEmail(email)
  }

  const sendForgotPasswordEmail = async email => {
    try {
 
      const forgotPasswordRequest = await  fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email})
      })

      const forgotPasswordResponse = await forgotPasswordRequest.json()

      if (forgotPasswordResponse.success && forgotPasswordResponse.success === true) {
        setSuccessMessage(forgotPasswordResponse.message)
      } else {
        setErrorMessage(forgotPasswordResponse.error)
      }

    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className={[loginStyles.forgotPassword, "page"].join(" ")}>
        <Head>
            <title>Forgot Password</title>
        </Head>
      <nav>
        <Link href={"/create-account"} passHref={true}>
        <Button label="LOG IN" theme="outline" onClicked={() => router.push("/login")} />
        </Link>
      </nav>

      

      <main className="centerSelfHorizontal displayFlex flexColumn centerColumnHorizontal">
        <svg
          width="51"
          height="50"
          viewBox="0 0 51 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask id="path-1-inside-1_609_14022" fill="white">
            <path d="M50.5 25C50.5 38.8071 39.3071 50 25.5 50C11.6929 50 0.5 38.8071 0.5 25C0.5 11.1929 11.6929 0 25.5 0C39.3071 0 50.5 11.1929 50.5 25ZM10.5 25C10.5 33.2843 17.2157 40 25.5 40C33.7843 40 40.5 33.2843 40.5 25C40.5 16.7157 33.7843 10 25.5 10C17.2157 10 10.5 16.7157 10.5 25Z" />
          </mask>
          <path
            d="M50.5 25C50.5 38.8071 39.3071 50 25.5 50C11.6929 50 0.5 38.8071 0.5 25C0.5 11.1929 11.6929 0 25.5 0C39.3071 0 50.5 11.1929 50.5 25ZM10.5 25C10.5 33.2843 17.2157 40 25.5 40C33.7843 40 40.5 33.2843 40.5 25C40.5 16.7157 33.7843 10 25.5 10C17.2157 10 10.5 16.7157 10.5 25Z"
            stroke="#98BF0B"
            strokeWidth="40"
            mask="url(#path-1-inside-1_609_14022)"
          />
          <mask id="path-2-inside-2_609_14022" fill="white">
            <path d="M50.5 25C50.5 20.3894 49.225 15.8687 46.816 11.9375C44.407 8.00639 40.9578 4.81799 36.8498 2.72484C32.7417 0.631687 28.1349 -0.284673 23.5385 0.0770666C18.9422 0.438807 14.5354 2.06456 10.8054 4.77457C7.07535 7.48459 4.1674 11.1733 2.40301 15.4329C0.638628 19.6925 0.0865413 24.3571 0.807791 28.9109C1.52904 33.4647 3.49553 37.7303 6.48985 41.2362C9.48417 44.7421 13.3897 47.3517 17.7746 48.7764L20.8647 39.2658C18.2338 38.411 15.8905 36.8453 14.0939 34.7417C12.2973 32.6382 11.1174 30.0788 10.6847 27.3465C10.2519 24.6142 10.5832 21.8155 11.6418 19.2597C12.7004 16.704 14.4452 14.4908 16.6832 12.8647C18.9212 11.2387 21.5653 10.2633 24.3231 10.0462C27.0809 9.8292 29.845 10.379 32.3099 11.6349C34.7747 12.8908 36.8442 14.8038 38.2896 17.1625C39.735 19.5212 40.5 22.2337 40.5 25H50.5Z" />
          </mask>
          <path
            d="M50.5 25C50.5 20.3894 49.225 15.8687 46.816 11.9375C44.407 8.00639 40.9578 4.81799 36.8498 2.72484C32.7417 0.631687 28.1349 -0.284673 23.5385 0.0770666C18.9422 0.438807 14.5354 2.06456 10.8054 4.77457C7.07535 7.48459 4.1674 11.1733 2.40301 15.4329C0.638628 19.6925 0.0865413 24.3571 0.807791 28.9109C1.52904 33.4647 3.49553 37.7303 6.48985 41.2362C9.48417 44.7421 13.3897 47.3517 17.7746 48.7764L20.8647 39.2658C18.2338 38.411 15.8905 36.8453 14.0939 34.7417C12.2973 32.6382 11.1174 30.0788 10.6847 27.3465C10.2519 24.6142 10.5832 21.8155 11.6418 19.2597C12.7004 16.704 14.4452 14.4908 16.6832 12.8647C18.9212 11.2387 21.5653 10.2633 24.3231 10.0462C27.0809 9.8292 29.845 10.379 32.3099 11.6349C34.7747 12.8908 36.8442 14.8038 38.2896 17.1625C39.735 19.5212 40.5 22.2337 40.5 25H50.5Z"
            stroke="url(#paint0_linear_609_14022)"
            strokeWidth="40"
            mask="url(#path-2-inside-2_609_14022)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_609_14022"
              x1="25.5"
              y1="0"
              x2="25.5"
              y2="50"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1D1272" />
              <stop offset="1" stopColor="#6C5CE6" />
            </linearGradient>
          </defs>
        </svg>

        <h1>Forgot Password</h1>
        <p>Pharmacy Center</p>

        {
          errorMessage && <ErrorBox errorMessage={errorMessage} closeErrorBox={() => setErrorMessage("")} />
      }

      {
          successMessage && <SuccessBox successMessage={successMessage} closeSuccessBox={() => setSuccessMessage("")} />
      }

        <form onSubmit={(event) => {validateEmail(event)}}>
            <LabeledTextInput label="Email">
                <TextInput placeholder="care@MedUp.com" type="email" />
            </LabeledTextInput>

            <div className="mt20"></div>


            <Button theme="solid" label="SEND PASSWORD RESET LINK" />

        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
