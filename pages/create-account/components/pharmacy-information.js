import Head from 'next/head';
import React, { useRef } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react/cjs/react.development';
import Button from '../../../components/atoms/Button';
import DropDown from '../../../components/atoms/DropDown';
import TextInput from '../../../components/atoms/textInput';
import LabeledTextInput from '../../../components/molecules/LabeledTextInput';
import { stateLGAs, states } from '../../../constants';
import caStyles from "../styles/styles.module.css"
import { iconsSVGs } from '../../../assets/images/icons';
import {postPlain} from '../../../requests/postPlain';

const PharmacyInformation = ({currentPharmacyDetails, updatePharmacyDetails}) => {
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState("")
    const [locations, setLocations] = useState([])
    const pharmacyFormRef = useRef(null)

    const validatePharmacyData = submitEvent => {
        submitEvent.preventDefault()

        console.log("Validating");

        if (!currentPharmacyDetails.pharmacyInformation.registration_number || currentPharmacyDetails.pharmacyInformation.registration_number === "") {
            setErrorMessage("Please enter a pharmacy registration number.")
        } else if (!currentPharmacyDetails.pharmacyInformation.first_address || currentPharmacyDetails.pharmacyInformation.first_address === "") {
            setErrorMessage("Please enter your pharmacy's primary address.")
        } else if(!currentPharmacyDetails.pharmacyInformation.coordinates) {
            setErrorMessage("Please set your pharmacy's location.")
        } else {
            goToDocumentation()
        }
    }

    const goToDocumentation = () => {
        router.push("/create-account/documentation")
    }

    const updateDetails = async updateEvent => {
        const field = updateEvent.target.name
        const value = updateEvent.target.value
        console.log({field, value});
        updatePharmacyDetails(value, field)

        if (field === "address"){
            try {
                const places = await postPlain("autocomplete", {searchString: value})

                if (places.success){
                    const temp = [...locations]
                    temp = places.data
                    setLocations(temp)
                }
            } catch (error) {
                console.log((error));
            }
        }
    }

    const getCoordinates = async (location) => {
        
        try {
            const coordinates = await postPlain("getCoordinates", {placeID: location.place_id})
            if (coordinates.success){
                var temp = {...currentPharmacyDetails}
                updatePharmacyDetails(coordinates.data, "coordinates")

                temp = [...locations]
                temp = []
                setLocations(temp)

                updatePharmacyDetails(location.description, "first_address")

            }
        } catch (error) {
            console.log({error});
        }
    }

    return (
        <div className={caStyles.pharmacyInformation}>
            <Head>
                <title>Pharmacy Information</title>
            </Head>

            <main className='centerSelfHorizontal displayFlex flexColumn'>
            
            <h2>Add Pharmacy Information</h2>

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

            <form ref={pharmacyFormRef} onChange={event => updateDetails(event)} onSubmit={event => validatePharmacyData(event)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <LabeledTextInput label={"Pharmacy Registration Number (Required) "}>
                                    <TextInput value={currentPharmacyDetails?.pharmacyInformation?.registration_number} name="registration_number" />
                                </LabeledTextInput>
                            </td>
                            <td>
                                <LabeledTextInput label={"Name of Pharmacy"}>
                                    <TextInput value={currentPharmacyDetails.pharmacyName} name="pharmacyName" />
                                </LabeledTextInput>
                            </td>
                        </tr>

                        <tr>
                        <td className={caStyles.address}>
                                <LabeledTextInput label={"Address (Required)"}>
                                    <div className='displayFlex'>
                                    <TextInput placeholder={"Enter your address to select your location. Required for delivery."} value={currentPharmacyDetails?.pharmacyInformation?.superintendent_last_name} name="address" />

                                    <TextInput  value={currentPharmacyDetails?.pharmacyInformation?.first_address} disabled={true}/>
                                    </div>
                                </LabeledTextInput>

                                <div className={caStyles.locationResults}>
                                    {
                                        locations.map((location, index) => <p onClick={() => {getCoordinates(location)}} key={index}>{location.description}</p>)
                                    }
                                </div>
                            </td>
                            <td>
                                <LabeledTextInput label={"Address 2"}>
                                    <TextInput value={currentPharmacyDetails?.pharmacyInformation?.second_address} name="second_address" />
                                </LabeledTextInput>
                            </td>
                        </tr>

                        <tr>
                        <td>
                                <LabeledTextInput label={"State"}>
                                    <DropDown defaultValue={currentPharmacyDetails?.pharmacyInformation?.state} name="state" options={states} placeholder={"Lagos"} />
                                </LabeledTextInput>
                            </td>
                            <td>
                                <LabeledTextInput label={"LGA"}>
                                    <DropDown defaultValue={currentPharmacyDetails?.pharmacyInformation?.lga} name={"lga"} options={stateLGAs[String(currentPharmacyDetails.pharmacyInformation.state).toLowerCase().split(" ").join("")].lgas} placeholder={"Ikeja"} />
                                </LabeledTextInput>
                            </td>
                        </tr>

                        <tr>
                            <td>
                        <LabeledTextInput label={"First Name of Business Owner (Optional)"}>
                                    <TextInput value={currentPharmacyDetails?.pharmacyInformation?.owner_first_name} name="owner_first_name" />
                                </LabeledTextInput>
                            </td>
                            <td>
                                <LabeledTextInput label={"Last Name of Business Owner (Optional)"}>
                                    <TextInput value={currentPharmacyDetails?.pharmacyInformation?.owner_last_name} name="owner_last_name" />
                                </LabeledTextInput>
                            </td>
                        </tr>

                        <tr>
                        <td>
                        <LabeledTextInput label={"First Name of Superitendent Pharmacist"}>
                                    <TextInput value={currentPharmacyDetails?.pharmacyInformation?.superintendent_first_name} name="superintendent_first_name" />
                                </LabeledTextInput>
                            </td>
                            <td>
                                <LabeledTextInput label={"Last Name of Superitendent Pharmacist"}>
                                    <TextInput value={currentPharmacyDetails?.pharmacyInformation?.superintendent_last_name} name="superintendent_last_name" />
                                </LabeledTextInput>
                            </td>
                        </tr>
                    </tbody>
                </table>

                
            <div className='pt20 pr20'>
            <div className={[caStyles.brokenDivider, "brokenDivider"].join(" ")}></div>
            </div>

            <footer>
            <Button type="submit" label={"Next"} buttonIntent={"next"} theme={"solid"} />
            </footer>
            </form>

            </main>
        </div>
    )
}

export default PharmacyInformation;