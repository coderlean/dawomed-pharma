import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import { iconsSVGs } from '../../assets/images/icons';
import ButtonLoader from '../../components/atoms/ButtonLoader';
import LoggedInLayout from '../../components/layouts/LoggedInLayout/loggedinLayout';
import Accordion from '../../components/molecules/Accordion';
import { stateLGAs, states } from '../../constants';
import { getProtected } from '../../requests/getProtected';
import { postProtected } from '../../requests/postProtected';
import { postProtectedMultiPart } from '../../requests/postProtectedMultiPart';
import { putProtected } from '../../requests/putProtected';
import styles from "./styles/styles.module.css"

const Account = () => {
    const [activeTab, setActiveTab] = useState("general")
    const [pharmacyInformation, setPharmacyInformation] = useState({})
    const [banks, setBanks] = useState([])
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        fetchPharmacyInformation()
    }, [])

    const changeActiveTab = newTab => {
        setActiveTab(newTab)
    }

    const getTitle = () => {
        switch (activeTab) {
            case "general":
                return "Account Settings"
                case "terms":
                return "Terms And Conditions"
            default:
                return ""
        }
    }

    const fetchPharmacyInformation = async () => {
        try {
            const fetchPharmacyInfoRequest = await getProtected("pharmacies/profile-and-settings")

            if (fetchPharmacyInfoRequest && fetchPharmacyInfoRequest.status === "OK") {
                let temp = {...pharmacyInformation}
                temp = fetchPharmacyInfoRequest.data.pharmacy
                setPharmacyInformation(temp)
                temp = [...banks]
                temp = fetchPharmacyInfoRequest.data.banks
                setBanks(temp)
            }

            console.log({fetchPharmacyInfoRequest});
        } catch (error) {
            console.log({error});
        }
    }

    const showErrorMessage = message => {
        setErrorMessage(message)

        setTimeout(() => {
            setErrorMessage("")
        }, 5000)
    }

    const showSuccessMessage = message => {
        setSuccessMessage(message)

        setTimeout(() => {
            setSuccessMessage("")
        }, 5000)
    }


    return (
        <div className={styles.account}>
            {
                errorMessage && <div className={[styles.floating, styles.error].join(" ")}>
                <p>{errorMessage}</p>
            </div>
            }

            {
                successMessage && <div className={[styles.floating, styles.success].join(" ")}>
                <p>{successMessage}</p>
            </div>
            }

            <nav>
                <div className={activeTab === "general" && styles.active} onClick={() => changeActiveTab("general")}>
                    General
                </div>

                {/* <div className={activeTab === "promotion" && styles.active} onClick={() => changeActiveTab("promotion")}>
                    Promotion
                </div> */}

                <div className={activeTab === "terms" && styles.active} onClick={() => changeActiveTab("terms")}>
                    Terms & Conditions
                </div>
            </nav>

            <div className={styles.title}>
                <h2>{getTitle()}</h2>
            </div>

            {
                activeTab === "general" && <General banks={banks} pharmacy={pharmacyInformation} showSuccessMessage={(message) => showSuccessMessage(message)} showErrorMessage={message => showErrorMessage(message)} />
            }

            {
                activeTab === "promotion" && <Promotion />
            }

            {
                activeTab === "terms" && <Terms />
            }

            



        </div>
    )
}

Account.getLayout = function getLayout (page) {
    return <LoggedInLayout>
        {page}
    </LoggedInLayout>
}

const General = ({banks, pharmacy, showErrorMessage, showSuccessMessage}) => {
    const [accountDetails, setAccountDetails] = useState({})
    const [pharmacyDetails, setPharmacyDetails] = useState({
    })
    const [pharmDetails, setPharmDetails] = useState({})
    const [bankDetails, setBankDetails] = useState({})
    const [documentation, setDocumentation] = useState({})
    const [password, setPasswords] = useState({})
    const storeLogoInputRef = useRef(null)
    const doc1InputRef = useRef(null)
    const doc2InputRef = useRef(null)
    const [newLogoFile, setNewLogoFile] = useState(null)
    const [newLogo, setNewLogo] = useState("")
    const currentDate = new Date()
    const [updating, setUpdating] = useState(false)
    

    useEffect(() => {
        fetchPharmDetails()
    }, [])

    const fetchPharmDetails = async () => {
        try {
            const fetchPharmDetailsRequest = await getProtected("pharmacies/current")
            
            if (fetchPharmDetailsRequest && fetchPharmDetailsRequest.status === "OK") {

                let temp = {...pharmDetails}
                temp = fetchPharmDetailsRequest.data
                setPharmDetails(temp)

                temp = {...accountDetails}
                temp["email"] = fetchPharmDetailsRequest.data.email
                temp["contact_number"] = fetchPharmDetailsRequest.data.contact_number
                temp["contact_number_2"] = fetchPharmDetailsRequest.data.contact_number_2
                temp["regPharmacistName"] = fetchPharmDetailsRequest.data.regPharmacistName
                setAccountDetails(temp)

                temp = {...bankDetails}
                temp["bank"] = fetchPharmDetailsRequest?.data?.bankDetails?.bank ? fetchPharmDetailsRequest?.data?.bankDetails?.bank : {}
                temp["account_name"] = fetchPharmDetailsRequest?.data?.bankDetails?.account_name
                temp["accountNumber"] = fetchPharmDetailsRequest?.data?.bankDetails?.accountNumber
                setBankDetails(temp)
            }

            

        } catch (error) {
            console.log({error});
        }
    }

    const verifyAccountDetails = async (event) => {
        const field = event.target.name
        const value = event.target.value
    }

    const updateAccountInformation = event => {
        let field = event.target.name
        let value = event.target.value

       let temp = {...accountDetails}
       temp[field] = value
       setAccountDetails(temp)
    }

    useEffect(() => {
        if (pharmacy && Object.values(pharmacy).length > 0) {
            let temp = {...pharmacyDetails}
            temp = pharmacy.pharmacyInformation
            setPharmacyDetails(temp)
        }
    }, [pharmacy])

 

    const saveNewPharmacyDetails = async (event, type, payload) => {
        event.preventDefault()
        setUpdating(true)
        try {
            const saveNewPharmacyDetailsRequest = await putProtected("pharmacies/update", {type, payload})

            setUpdating(false)

            if (saveNewPharmacyDetailsRequest && saveNewPharmacyDetailsRequest.status === "OK") {
                showSuccessMessage(`${type} has been updated successfully`)
            } else {
                showErrorMessage("An error occured while updating pharmacy details")
            }

        } catch (error) {
            console.log({error});
        }
    }

    const updatePharmacyInformation = event => {
        let field = event.target.name
        let value = event.target.value

        console.log({field, value});

         let temp = {...pharmacyDetails}
            temp[field] = value
            setPharmacyDetails(temp)
    }

    const updateBankDetails = async event => {
        let field = event.target.name
        let value

        if (field === "bank") {
            value = JSON.parse(event.target.value)
        } else {
            value = event.target.value
        }

        setUpdating(true)

        let temp = {...pharmDetails}
        temp.bankDetails.account_name = ""
        setPharmDetails(temp)

        if (field === "bank" && bankDetails.accountNumber.length === 10) {
            const confirmBankDetails = await postProtected("verifyBankAccountDetails", {bank: value, accountNumber: bankDetails.accountNumber})


            setUpdating(false)
            if (confirmBankDetails && confirmBankDetails.status === "OK") {
                temp = {...bankDetails}
            temp["account_name"] = confirmBankDetails.data.account_name
            setBankDetails(temp)

            temp = {...pharmDetails}
            temp.bankDetails.account_name = confirmBankDetails.data.account_name
            setPharmDetails(temp)
            }
        
        } else if (field === "accountNumber" && value.length === 10 && bankDetails.bank && Object.values(bankDetails.bank).length > 0) {
            const confirmBankDetails = await postProtected("verifyBankAccountDetails", {bank: bankDetails.bank, accountNumber: value})
            setUpdating(false)
            if (confirmBankDetails && confirmBankDetails.status === "OK") {
                temp = {...bankDetails}
            temp["account_name"] = confirmBankDetails.data.account_name
            setBankDetails(temp)

            temp = {...pharmDetails}
            temp.bankDetails.account_name = confirmBankDetails.data.account_name
            setPharmDetails(temp)
            }
        }

        temp = {...bankDetails}
        temp[field] = value
        setBankDetails(temp)
    }

    const updatePasswords = event => {
        let field = event.target.name
        let value = event.target.value

        let temp = {...password}
        temp[field] = value
        setPasswords(temp)
    }

    const validatePasswords = () => {
        if (!password.newPassword || !password.confirmPassword) {
            showErrorMessage("Please fill in all password fields")
            return false
        } else if (password.newPassword !== password.confirmPassword) {
            showErrorMessage("Passwords do not match")
            return false
        } else {
            return true
        }
    }

    const setNewPassword = async event => {
        event.preventDefault()

        setUpdating(true)

        if (validatePasswords()) {
            try {
                const setNewPasswordRequest = await postProtected("auth/updatePassword", password)

                setUpdating(false)

                if (setNewPasswordRequest && setNewPasswordRequest.status === "OK") {
                    showSuccessMessage("Password updated successfully")
                } else {
                    showErrorMessage(setNewPasswordRequest.error.message)
                }
            } catch (error) {
                console.log({error});
            }
        }
    }

    var loadFile = function(event) {

        setNewLogo(URL.createObjectURL(event.target.files[0]))

        const form = new FormData()
        form.append("logo", event.target.files[0])
        setNewLogoFile(form)
        // output.onload = function() {
        //   URL.revokeObjectURL(output.src) // free memory
        // }
    }

    const uploadNewLogo = async () => {
        try {
            setUpdating(true)
            const uploadNewLogoRequest = await postProtectedMultiPart("pharmacies/uploadLogo", newLogoFile)
            setUpdating(false)
            
            if (uploadNewLogoRequest && uploadNewLogoRequest.status === "OK") {
                showSuccessMessage("Store logo updated successfully")
            } else {
                showErrorMessage("An error occured while uploading new logo")
            }
        } catch (error) {
            console.log({error});
        }
    }

    const validateDocuments = (event) => {
        event.preventDefault()
        if (documentation.premise_license_expiry_date && !documentation.premise_license) {
            showErrorMessage("Please add a premise license")
        } else if (documentation.premise_license && !documentation.premise_license_expiry_date) {
            showErrorMessage("Please set premise license expiry date")
        } else if (getDateTime(documentation.premise_license_expiry_date) < currentDate.getTime()) {
            showErrorMessage("Premise license expiry date cannot be in the past")
        } else if (documentation?.pharmacist_license_expiry_date && !documentation.pharmacist_license) {
            showErrorMessage("Please add a pharmacy license")
        } else if (documentation.pharmacist_license && !documentation.pharmacist_license_expiry_date) {
            showErrorMessage("Please set pharmacist license expiry date")
        }   else if (getDateTime(documentation.pharmacist_license_expiry_date) < currentDate.getTime()) {
            showErrorMessage("Pharmacist license expiry date cannot be in the past")
        } else {
            handleDocumentSubmit()
        }
    }

    const handleDocumentSubmit = async () => {

        const form = new FormData()

        if (documentation.premise_license) {
            form.append("premise_license", documentation.premise_license)
            form.append("premise_license_expiry_date", documentation.premise_license_expiry_date)
        }

        if (documentation.pharmacist_license) {
            form.append("pharmacist_license", documentation.pharmacist_license)
            form.append("pharmacist_license_expiry_date", documentation.pharmacist_license_expiry_date)
        }

        console.log({form});


        
        try {
            setUpdating(true)
            const uploadNewDucumentation = await postProtectedMultiPart("pharmacies/updateDocumentation", form)
            setUpdating(false)
            
            if (uploadNewDucumentation && uploadNewDucumentation.status === "OK") {
                showSuccessMessage("Updated documentation successfully")

                let temp = {...pharmDetails}
                temp.documentation = uploadNewDucumentation.data
                setPharmDetails(temp)
            } else {
                showErrorMessage("An error occured while uploading new logo")
            }
        } catch (error) {
            console.log({error});
        }

    }

    const getDateTime = date => {
        const theDate = new Date(date)
        return theDate.getTime()
    }

    const updateDocumentation = event => {
        let field = event.target.name

        let value

        if (field === "premise_license" || field === "pharmacist_license") {
            value = event.target.files[0]
        } else {
            value = event.target.value
        }

        let temp = {...documentation}
        temp[field] = value
        setDocumentation(temp)
    }




    


    return (
        <div className={styles.general}>
        <Accordion title={"Account Information"} >
            <div className={styles.forms}>
                <form onChange={event => updateAccountInformation(event)} onSubmit={(event) => saveNewPharmacyDetails(event,"Account information", accountDetails)}>
                    <table>
                        <tbody>
                            {/* <tr>
                                <td>
                                    <label>Pharma ID</label>
                                </td>

                                <td>
                                    <input placeholder='Pharmacy ID' />
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    <label>Pharmacy Name</label>
                                </td>

                                <td>
                                    <input placeholder='Pharmacy Name' />
                                </td>
                            </tr> */}



                            <tr>
                                <td>
                                    <label>Email Address</label>
                                </td>

                                <td>
                                    <input placeholder='Email Address' name="email" defaultValue={pharmDetails.email} />
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>Contact Number</label>
                                </td>

                                <td>
                                    <input placeholder='Contact Number 1' name="contact_number_1" defaultValue={pharmDetails.contact_number} />
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>Contact Number 2</label>
                                </td>

                                <td>
                                    <input placeholder='Contact Number 2' name="contact_number_2" />
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>Pharmacist Name</label>
                                </td>

                                <td>
                                    <input placeholder='Pharmacist Name' name='regPharmacistName' defaultValue={pharmDetails.regPharmacistName} />
                                </td>
                            </tr>

                            <tr>
                                <td>

                                </td>

                                <td>
                                    <button disabled={updating}>Submit {updating && <ButtonLoader />}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </Accordion>

        <hr />

        <Accordion title={"Store Logo"} >
            <div className={styles.storeLogo}>
                <div>
                    {!newLogo && iconsSVGs.pharmImage}

                    {
                        newLogo && <img src={newLogo} className={styles.newLogo} />
                    }
                </div>

                <div className={"cursorPointer"} >
                    <div>
                        {
                            iconsSVGs.placeholderImage
                        }

                        <div className={styles.selectLogoDiv} onClick={() => storeLogoInputRef.current.click()}>
                        <p>Click to replace</p>
                        <p>SVG, PNG, JPG or GIF (max 1000 x 1000px)</p>
                        </div>

                        

                        <input type={"file"} ref={storeLogoInputRef} style={{display: "none"}} onChange={event => loadFile(event)}  />

                        <button disabled={updating} style={{marginTop: "10px"}} onClick={() => uploadNewLogo()}>Upload new logo {updating && <ButtonLoader />}</button>
                    </div>
                </div>
            </div>
        </Accordion>

        <hr />

        <Accordion title={"Pharmacy Information"} >
            <div className={styles.forms}>
                <form onChange={event => updatePharmacyInformation(event)} onSubmit={(event) => saveNewPharmacyDetails(event,"Pharmacy information", {pharmacyInformation: pharmacyDetails})}>
                    <table>
                        <tbody>
                            {/* <tr>
                                <td>
                                    <label>Pharmacy Registration Number</label>
                                </td>

                                <td>
                                    <input placeholder='Pharmacy ID' />
                                </td>
                            </tr> */}


                            {/* <tr>
                                <td>
                                    <label>Name of Pharmacy</label>
                                </td>

                                <td>
                                    <input placeholder='Pharmacy Name' />
                                </td>
                            </tr> */}



                            <tr>
                                <td>
                                    <label>Address 1</label>
                                </td>

                                <td>
                                    <input placeholder='Address 1' name="first_address" defaultValue={pharmDetails?.pharmacyInformation?.first_address} />
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>Address 2</label>
                                </td>

                                <td>
                                    <input placeholder='Address 2' name="second_address" defaultValue={pharmDetails?.pharmacyInformation?.second_address} />
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>State</label>
                                </td>

                                <td>
                                    <select name='state' defaultChecked={pharmacyDetails.state ? pharmacyDetails.state : "Abia"} defaultValue={pharmacyDetails.state ? pharmacyDetails.state : "Abia"}>
                                        {
                                            states.map((item, index) => <option key={index}>{item}</option>)
                                        }
                                    </select>
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>LGA</label>
                                </td>

                                <td>
                                    <select name='lga' defaultChecked={pharmacyDetails.lga} defaultValue={pharmacyDetails.lga}>
                                    {
                                            stateLGAs[String(pharmacyDetails?.state).toLowerCase().split(" ").join("")]?.lgas.map((item, index) => <option key={index}>{item}</option>)
                                        }
                                    </select>
                                </td>
                            </tr>

                            {/* <tr>
                                <td>
                                    <label>Business Owner DOB</label>
                                </td>

                                <td>
                                    <input placeholder='Pharmacy ID' />
                                </td>
                            </tr> */}

                            <tr>
                                <td>
                                    <label>Are you VAT registered?</label>
                                </td>

                                <td>
                                    <select name='vat_registered'>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <td>

                                </td>

                                <td>
                                    <button disabled={updating}>Update Pharmacy Information {updating && <ButtonLoader />}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </Accordion>

        <hr />

        <Accordion title={"Documentation"} >
            <form className={styles.documentation} onSubmit={event => validateDocuments(event)} onChange={event => updateDocumentation(event)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                {
                                    iconsSVGs.documentIcon
                                }
                        
                                <label>Superintendent Pharmacist License</label>
                            </td>

                            <td>
                                {
                                    getDateTime(pharmDetails?.documentation?.pharmacist_license_expiry_date) < currentDate.getTime() && <p>Expired</p>
                                }
                            </td>

                            <td>
                                {
                                    documentation.pharmacist_license && <p>{documentation?.pharmacist_license?.name}</p>
                                }
                            </td>

                            <td>
                                <input placeholder='Expiry date' type={"date"} className={styles.expiryDateInput} defaultValue={pharmDetails?.documentation?.pharmacist_license_expiry_date} name="pharmacist_license_expiry_date"  />
                            </td>

                            <td>
                                <button onClick={() => doc1InputRef.current.click()} type="button">Select Document</button>
                                <input type={"file"} ref={doc1InputRef} style={{display : "none"}} name="pharmacist_license" />
                            </td>
                        </tr>


                        <tr>
                            <td>
                                {
                                    iconsSVGs.documentIcon
                                }
                        
                                <label>Premise License</label>
                            </td>

                            <td>
                                {/* <p>Expired</p> */}
                                {
                                    getDateTime(pharmDetails?.documentation?.premise_license_expiry_date) < currentDate.getTime() && <p>Expired</p>
                                }
                            </td>

                            <td>
                            {
                                    documentation.premise_license && <p>{documentation?.premise_license?.name}</p>
                                }
                            </td>

                            <td>
                                <input placeholder='Expiry date' type={"date"} className={styles.expiryDateInput} defaultValue={pharmDetails?.documentation?.premise_license_expiry_date} name="premise_license_expiry_date"  />
                            </td>

                            <td>
                                <button onClick={() => doc2InputRef.current.click()} type="button">Select Document</button>
                                <input type={"file"} ref={doc2InputRef} style={{display : "none"}} name="premise_license" />
                            </td>
                        </tr>

                        <tr>
                            <td>
                            </td>

                            <td>
                            </td>

                            <td>

                            </td>

                            <td></td>

                            <td>
                                <button disabled={updating} className={styles.button}>Update Documentation {updating && <ButtonLoader />}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>


                    

                    

                    
                </div>

            </form>
        </Accordion>

        <hr />

        <Accordion title={"Bank Details"} >
        <div className={styles.forms}>
                <form onChange={event => updateBankDetails(event)} onSubmit={(event) => saveNewPharmacyDetails(event,"Bank details", {bankDetails: bankDetails})}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label>Bank</label>
                                </td>

                                <td>
                                    <select name='bank'>
                                        <option selected disabled>Select bank</option>
                                        {
                                            banks.map((item, key) => <option key={item.id} value={JSON.stringify(item)}>{item.name}</option>)
                                        }
                                    </select>
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    <label>Account Number</label>
                                </td>

                                <td>
                                    <input placeholder='Account Number' name='accountNumber' defaultValue={pharmDetails?.bankDetails?.accountNumber} />
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>Account Name</label>
                                </td>

                                <td>
                                    <input disabled placeholder='Account Name' value={pharmDetails?.bankDetails?.account_name} />
                                </td>
                            </tr>

                            <tr>
                                <td>

                                </td>

                                <td>
                                    <button>Update Bank Details {updating && <ButtonLoader />}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </Accordion>

        <hr />

        <Accordion title={"Security/Authentication"} >
        <div className={styles.forms}>
                <form disabled={updating} onChange={event => updatePasswords(event)} onSubmit={event =>  setNewPassword(event)} >
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label>Current Password</label>
                                </td>

                                <td>
                                <input placeholder='Current Password' name='currentPassword' />
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    <label>New Password</label>
                                </td>

                                <td>
                                    <input placeholder='New Password' name='newPassword' />
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>Confirm Password</label>
                                </td>

                                <td>
                                    <input placeholder='Confirm Password' name='confirmPassword' />
                                </td>
                            </tr>

                            <tr>
                                <td>

                                </td>

                                <td>
                                    <button disabled={updating} >Update Password {updating && <ButtonLoader />}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </Accordion>
    </div>
    )
}

const Promotion = () => {
    return (
        <div className={styles.promotion}>
            <p>Coming soon!</p>
        </div>
    )
}

const Terms = () => {
    return (
        <div className={styles.terms}>
            <p>
In euismod eu aenean bibendum. Ut accumsan sem euismod blandit at erat velit faucibus ultricies risus pulvinar. Netus suspendisse platea aliquet ipsum fames ultrices laoreet nunc netus rutrum arcu lacus. Morbi praesent integer; sociosqu varius sodales sociosqu curabitur nascetur justo molestie orci lacinia. Curabitur nam congue sit scelerisque cras. Felis ullamcorper tempor donec ullamcorper in placerat nulla convallis. Parturient ultrices aenean adipiscing sed semper blandit varius, sagittis nostra litora taciti et. Rhoncus fermentum amet elit amet nec nam congue primis. Nascetur consectetur posuere.
</p>
<p>
Fringilla, varius congue penatibus pretium ullamcorper. Nam volutpat metus netus porttitor augue purus vivamus scelerisque cubilia imperdiet netus eget. Cras, dui primis libero ad euismod justo sagittis penatibus placerat. Fringilla potenti mollis in justo nullam aliquet nibh vehicula curabitur habitasse magna habitasse. Vel dictum nam sodales nam non. At aliquet laoreet id. Vivamus commodo velit posuere ut malesuada et in amet primis. Sociosqu rhoncus erat hendrerit proin, pulvinar ridiculus placerat.
</p>
<p>
Euismod fames hac venenatis quis augue, ligula eros eu. Lobortis, tempor viverra condimentum interdum consectetur consectetur. Est rutrum magnis vehicula. Sit nisl quam risus natoque ridiculus. Lacus adipiscing morbi dignissim commodo natoque. Ac at purus venenatis justo placerat nisi tristique. Platea neque nisi sodales eget mattis. Purus magnis elit ornare litora ad. Bibendum rhoncus venenatis iaculis. Laoreet duis penatibus in egestas pulvinar vel parturient mi himenaeos vulputate. Ultricies class arcu amet aptent class faucibus nulla nunc vulputate. Aptent tempor donec potenti velit a. Diam ullamcorper pulvinar fringilla rutrum a.
</p>
<p>
Nisl augue nunc suscipit ipsum nisi gravida suspendisse taciti ad est. Amet porta gravida class? Parturient lorem dui dignissim aliquam ante dictumst ornare mattis leo nisi. Magna dis velit nam condimentum fermentum, duis pulvinar. Pellentesque fames volutpat nisl proin augue ultricies, mattis dapibus nisi quisque dapibus. Montes hac hendrerit morbi torquent potenti viverra lacus hendrerit! Consequat neque parturient molestie nulla luctus. Dignissim adipiscing nostra rhoncus. Cras leo congue, a curae; congue lacus feugiat pulvinar. Arcu semper ligula suspendisse ante sociosqu pulvinar cursus erat duis accumsan! Per, sit nostra.
</p>
<p>
Nisl nascetur, magna duis. Quam at netus et porttitor erat varius orci rhoncus bibendum neque netus varius. Congue enim non cubilia eu sem tristique ultricies malesuada dapibus ad a pulvinar. Dictumst quis ridiculus commodo nascetur conubia ad adipiscing posuere est nullam ullamcorper sollicitudin. Dis praesent lobortis tristique et neque curae; etiam dictumst mauris. Augue; aliquam eros lorem ligula tellus. Amet magna taciti porta nullam.
</p>
        </div>
    )
}


export default Account

