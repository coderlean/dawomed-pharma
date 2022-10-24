import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react/cjs/react.development';
import { iconsSVGs } from '../../assets/images/icons';
import Button from '../../components/atoms/Button';
import CheckBox from '../../components/atoms/CheckBox';
import PasswordInput from '../../components/atoms/PasswordInput';
import TextInput from '../../components/atoms/textInput';
import LabeledTextInput from '../../components/molecules/LabeledTextInput';
import CreateAccountSideBar from './components/sidebar';
import caStyles from "./styles/styles.module.css";
import { useRouter } from 'next/router';

const CreateAccount = () => {
    const [errorMessage, setErrorMessage] = useState("")
    const router = useRouter()

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    const validateSignupDetails = (signupEvent) => {
        signupEvent.preventDefault()

        if (signupEvent.target[0].value === "" || signupEvent.target[0].value.length < 3){
            setErrorMessage("Please set a name for your pharmacy")
        } else if (signupEvent.target[1].value === "" || signupEvent.target[1].value.length < 3){
            setErrorMessage("Please enter the name of your registered pharmacist")
        } else if (signupEvent.target[2].value === "" || signupEvent.target[2].value.length < 3){
            setErrorMessage("Please enter a contact phone number")
        } else if (signupEvent.target[3].value === "" || signupEvent.target[3].value.length < 3){
            setErrorMessage("Please enter your pharmacy's email address")
        } else if (signupEvent.target[4].value === "" || signupEvent.target[4].value.length < 3){
            setErrorMessage("Please set a password")
        } else if (!emailRegex.test(signupEvent.target[3].value)){
            setErrorMessage("You have to enter a valid email address")
        } else if (!passwordRegex.test(signupEvent.target[4].value)){
            setErrorMessage("Password must be at least 8 characters long and contain at least one upper case letter, a number and a special character")
        } else {
            const pharmacyDetails = {
                pharmacyName: signupEvent.target[0].value,
                regPharmacistName: signupEvent.target[1].value,
                email: signupEvent.target[3].value,
                contact_number: signupEvent.target[2].value,
                password:signupEvent.target[4].value
            }

            createAccountForPharmacy(pharmacyDetails)
        }
    }

    const createAccountForPharmacy = pharmacyDetails => {
        router.push({
            pathname: "/create-account/pharmacy-information",
            query: {
                pharmacyDetails: JSON.stringify(pharmacyDetails)
            }
        })
    }

    return (
        <div className={[caStyles.createAccount, "pageFixed displayFlex"].join(" ")}>
            <Head>
                <title>Create Account</title>
            </Head>

            <CreateAccountSideBar />

            <div className={caStyles.body}>
                <nav className="displayFlex jcEnd widthFull">
                    <Button onButtonClick={() => router.push("/login")} label="LOG IN" theme="outline" />
                </nav>

                <main className="centerSelfHorizontal">
                    <h2>Register and start selling today</h2>

                    {
                        errorMessage !== "" && <div className={[caStyles.errorMessage, "displayFlex jcSpaceBetween alignCenter"].join(" ")}>
                        <p>{errorMessage}</p>

                        <div onClick={() => setErrorMessage("")}>
                            {
                                iconsSVGs.closeIconWhite
                            }
                        </div>
                    </div>
                    }

                    <form onSubmit={event => validateSignupDetails(event)}>
                        <LabeledTextInput label="Name of Pharmacy">
                            <TextInput />
                        </LabeledTextInput>

                        <div className='separator20'></div>

                        <LabeledTextInput label="Registered Pharmacist Name">
                            <TextInput />
                        </LabeledTextInput>

                        <div className='separator20'></div>

                        <LabeledTextInput label="Contact Number">
                            <TextInput placeholder={"08012332123"} />
                        </LabeledTextInput>

                        <div className='separator20'></div>

                        <LabeledTextInput label="Email">
                            <TextInput placeholder={`user@dawomed.com`} />
                        </LabeledTextInput>

                        <div className='separator20'></div>

                        <LabeledTextInput label="Password">
                            <PasswordInput placeholder="***********"/>
                        </LabeledTextInput>

                        <div className='separator20'></div>

                        <CheckBox>
                            <span>I have read and accepted the <Link href="/">Privacy Policy and Terms of Use</Link></span>
                        </CheckBox>

                        <div className='separator20'></div>

                        <Button label="CONTINUE" theme="solid" />
                    </form>
                </main>

            </div>
        </div>
    )
}

export default CreateAccount;
