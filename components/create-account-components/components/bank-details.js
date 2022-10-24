import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/dist/client/router';
import { iconsSVGs } from '../../../assets/images/icons';
import Button from '../../../components/atoms/Button';
import DropDown from '../../../components/atoms/DropDown';
import TextInput from '../../../components/atoms/TextInput';
import LabeledTextInput from '../../../components/molecules/LabeledTextInput';
import caStyles from "./styles/styles.module.css"

const BankDetails = ({currentPharmacyDetails, updatePharmacyDetails}) => {
    const router = useRouter()
    const [banks, setBanks] = useState([])
    const [banksDetails, setBanksDetails] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [accountName, setAccountName] = useState("")
    const [verified, setVerified] = useState(false)
    const [selectedBankDetails, setSelectedBankDetails] = useState({})

    const validateBankDetails = submissionEvent => {
        submissionEvent.preventDefault()

        if (!currentPharmacyDetails.bankDetails.bank || Object.values(currentPharmacyDetails.bankDetails.bank).length === 0){
            setErrorMessage("You have not selected a bank")
        } else if (!currentPharmacyDetails.bankDetails.accountNumber){
            setErrorMessage("You have not entered your account number")
        } else if (!verified || verified === "verifying"){
            setErrorMessage("Your account has not been verified")
        } else {
            goToSummary()
        }
    }
    
    const goToSummary = () => {
        router.push("/create-account/summary")
    }

    useEffect(() => {
        fetchBanksList()  
    }, [])


    const fetchBanksList = async () => {
        try {
            const banksRequest = await fetch("http://localhost:5000/getAllBanks")
            const banksList = await banksRequest.json()
            setBanksDetails(banksList.data)

            const tempBanks = banksList.data.map((item => item.name))

            setBanks(tempBanks)
            setSelectedBankDetails(banksList.data[0])
            

            if (currentPharmacyDetails?.bankDetails?.bank) {
                updatePharmacyDetails(currentPharmacyDetails?.bankDetails?.bank, "bank")

                if (currentPharmacyDetails?.bankDetails?.accountNumber && String(currentPharmacyDetails?.bankDetails?.accountNumber).length === 10){
                    verifyAccountDetails(currentPharmacyDetails?.bankDetails?.bank, currentPharmacyDetails?.bankDetails?.accountNumber)
                }
            } else {
                updatePharmacyDetails(banksList.data[0], "bank")
            }
        } catch (error) {
            console.log({error});
        }
    }

    const updateBankDetails = (updateBankDetailsEvent) => {


        if (updateBankDetailsEvent.target.name === "bank"){ 
            const value = updateBankDetailsEvent.target.value
            const bankDetails = banksDetails.find(item => item.name === value)
            const field = updateBankDetailsEvent.target.name
            setSelectedBankDetails(bankDetails)
            updatePharmacyDetails(bankDetails, field)

            if (currentPharmacyDetails?.bankDetails?.accountNumber?.length === 10) {
                verifyAccountDetails(bankDetails, currentPharmacyDetails.bankDetails.accountNumber)
            }
        } else {
            const field = updateBankDetailsEvent.target.name
            const value = updateBankDetailsEvent.target.value
            updatePharmacyDetails(value, field)

            if (String(value).length === 10){
                verifyAccountDetails(currentPharmacyDetails.bankDetails.bank, value)
            }
        }
    }

    const verifyAccountDetails = async (bank, accountNumber) => {
        setAccountName("")
        setVerified("verifying")

        try {
            const verifyAccountDetailsRequest = await fetch("http://localhost:5000/verifyBankAccountDetails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accountNumber,
                    bank
                })
            })

            const accountVerificationResponse = await verifyAccountDetailsRequest.json()

            if (accountVerificationResponse.status === "OK"){
                setVerified(true)
                setAccountName(accountVerificationResponse.data.account_name)
                updatePharmacyDetails(accountVerificationResponse.data.account_name, "account_name")
                setErrorMessage("")
            } else {
                setVerified(false)
                setErrorMessage(accountVerificationResponse.message)
            }
        } catch (error) {
            console.log({error});
        }
    }

    return (
        <div className={caStyles.bankDetails}>
            <Head>
                <title>Bank Details</title>
            </Head>
        <main className='centerSelfHorizontal displayFlex flexColumn'>
        <h2>Bank Details</h2>


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

        
        <form onSubmit={event => validateBankDetails(event)} onChange={event => updateBankDetails(event)}  >
            <table>
                    <tbody>
                        <tr>
                            <td>
                                <LabeledTextInput label={"Bank (Required)"}>
                                    <DropDown defaultValue={currentPharmacyDetails?.bankDetails?.bank?.name ?  currentPharmacyDetails?.bankDetails?.bank?.name : ""}  name="bank" options={banks} placeholder="Select your bank" />
                                </LabeledTextInput>
                            </td>
                            <td>
                                <LabeledTextInput label={"Account Number (Required)"}>
                                    <TextInput value={currentPharmacyDetails?.bankDetails?.accountNumber ? currentPharmacyDetails?.bankDetails?.accountNumber : ""} placeholder="Your bank account number" name="accountNumber" type="number" />
                                </LabeledTextInput>
                            </td>
                        </tr>

                        <tr>
                        <td>
                                <LabeledTextInput label={verified === true ? "Account Name (Verified)" : verified === "verifying" ? "Account Name (Verifying account...)" : "Account Name (Unverified)"}>
                                    <TextInput value={currentPharmacyDetails?.bankDetails?.account_name ? currentPharmacyDetails?.bankDetails?.account_name : ""} placeholder={"Your account name"} disabled={true}  />
                                </LabeledTextInput>
                            </td>
                            {/* <td>
                                <LabeledTextInput label={"IBAN"}>
                                    <TextInput />
                                </LabeledTextInput>
                            </td> */}
                        </tr>

                        {/* <tr>
                        <td>
                                <LabeledTextInput label={"SWIFT"}>
                                    <TextInput />
                                </LabeledTextInput>
                            </td>
                            <td>
                                
                            </td>
                        </tr> */}




                    </tbody>
            </table>
            

            <div className='pt20 pr20'>
            <div className={[caStyles.brokenDivider, "brokenDivider"].join(" ")}></div>
            </div>

            <footer>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <Button onButtonClick={() => router.push("/create-account/documentation")} type="button" label={"PREVIOUS"} buttonIntent={"previous"} theme={"outline"} />
                        </td>

                        <td>
                            <Button label={"NEXT"} buttonIntent={"next"} theme={"solid"} />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className='mt20 displayFlex jcCenter'>
            {/* <Link href="/create-account/summary">SKIP THIS STEP</Link> */}
            </div>
            </footer>
        </form>
        </main>
    </div>
    )
}

export default BankDetails;