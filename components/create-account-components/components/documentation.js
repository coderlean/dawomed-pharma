import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';

import Button from '../../../components/atoms/Button';
import DatePicker from '../../../components/molecules/DatePicker';
import FileSelector from '../../../components/molecules/FileSelector';
import LabeledTextInput from '../../../components/molecules/LabeledTextInput';
import caStyles from "./styles/styles.module.css"
import { iconsSVGs } from '../../../assets/images/icons';

const Documentation = ({currentPharmacyDetails, updatePharmacyDetails}) => {
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (!currentPharmacyDetails.pharmacyInformation.registration_number){
            router.push("/create-account");
        }
    }, [])
    console.log(currentPharmacyDetails.pharmacyInformation.registration_number);

    const onChange = updateDocumentationEvent => {
        updateDocumentationEvent.preventDefault()

        if (updateDocumentationEvent.target.files){
            const field = updateDocumentationEvent.target.name
            const value = updateDocumentationEvent.target.files[0]
            updatePharmacyDetails(value, field)
        } else {
            console.log(updateDocumentationEvent.target.value);
            const field = updateDocumentationEvent.target.name
            const value = updateDocumentationEvent.target.value
            updatePharmacyDetails(value, field)
        }
    }

    const validateData = (submissionEvent) => {
        submissionEvent.preventDefault()

        if (!currentPharmacyDetails.documentation.pharmacist_license){
            setErrorMessage("Your pharmacist license is required")
        } else if (!currentPharmacyDetails.documentation.premise_license){
            setErrorMessage("Your premise license is required")
        } else if (!currentPharmacyDetails.documentation.pharmacist_license_expiry_date) {
            setErrorMessage("Your pharmacist license expiry date is required")
        } else if (!currentPharmacyDetails.documentation.premise_license_expiry_date) {
            setErrorMessage("Your premise license expiry date is required")
        } else {
            goToBankDetails()
        }
    }

    const goToBankDetails = () => {
        router.push("/create-account/bank-details")
    }

    return (
        <div className={caStyles.documentation}>
            <Head>
                <title>Documentation</title>
            </Head>

            <form onSubmit={event => validateData(event)} onChange={e => onChange(e)}>
                <main className='centerSelfHorizontal displayFlex flexColumn'>
                    <h2>Pharmacy Documentation</h2>


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

                    <table>
                        <tbody>
                            <tr>
                                <td>
                            <LabeledTextInput label={"Superintendent Pharmacist License"}>
                                        <FileSelector defaultFileName={currentPharmacyDetails?.documentation?.pharmacist_license?.name} name="pharmacist_license" />
                                    </LabeledTextInput>
                                </td>
                                <td>
                                    <LabeledTextInput label={"Superintendent Pharmacist License Expiry Date"}>
                                        <DatePicker defaultValue={currentPharmacyDetails?.documentation?.pharmacist_license_expiry_date} name="pharmacist_license_expiry_date" />
                                    </LabeledTextInput>
                                </td>
                            </tr>

                            <tr>
                            <td>
                            <LabeledTextInput label={"Premise Licence"}>
                                        <FileSelector defaultFileName={currentPharmacyDetails?.documentation?.premise_license?.name} name="premise_license" />
                                    </LabeledTextInput>
                                </td>
                                <td>
                                    <LabeledTextInput label={"Premise Licence Expiry Date"}>
                                        <DatePicker defaultValue={currentPharmacyDetails?.documentation?.premise_license_expiry_date} name="premise_license_expiry_date" />
                                    </LabeledTextInput>
                                </td>
                            </tr>
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
                                    <Button type="button" onButtonClick={() => router.push("/create-account/pharmacy-information")} label={"Previous"} buttonIntent={"previous"} theme={"outline"} />
                                </td>

                                <td>
                                    <Button label={"Next"} buttonIntent={"next"} theme={"solid"} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </footer>
                </main>
            </form>
        </div>
    )
}

export default Documentation;