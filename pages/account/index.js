import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import { iconsSVGs } from '../../assets/images/icons';
import LoggedInLayout from '../../components/layouts/LoggedInLayout/loggedinLayout';
import Accordion from '../../components/molecules/Accordion';
import { stateLGAs, states } from '../../constants';
import { getProtected } from '../../requests/getProtected';
import styles from "./styles/styles.module.css"

const Account = () => {
    const [activeTab, setActiveTab] = useState("general")
    const [pharmacyInformation, setPharmacyInformation] = useState({})
    const [banks, setBanks] = useState([])

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


    return (
        <div className={styles.account}>
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
                activeTab === "general" && <General banks={banks} pharmacy={pharmacyInformation} />
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

const General = ({banks, pharmacy}) => {
    const [accountDetails, setAccountDetails] = useState({})
    const [pharmacyDetails, setPharmacyDetails] = useState({
    })
    const [bankDetails, setBankDetails] = useState({})
    const [storeLogo, setStoreLogo] = useState({})
    const [documentation, setDocumentation] = useState({})
    const [password, setPasswords] = useState({})
    const storeLogoInputRef = useRef(null)
    const doc1InputRef = useRef(null)
    const doc2InputRef = useRef(null)

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

    console.log({pharmacyDetails});

    return (
        <div className={styles.general}>
        <Accordion title={"Account Information"} >
            <div className={styles.forms}>
                <form onChange={event => updateAccountInformation(event)}>
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
                                    <input placeholder='Email Address' name="email" />
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>Contact Number</label>
                                </td>

                                <td>
                                    <input placeholder='Contact Number 1' name="contact_number_1" />
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
                                    <input placeholder='Pharmacist Name' name='pharmacist_name' />
                                </td>
                            </tr>

                            <tr>
                                <td>

                                </td>

                                <td>
                                    <button>Submit</button>
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
                    {iconsSVGs.pharmImage}
                </div>

                <div className={"cursorPointer"} onClick={() => storeLogoInputRef.current.click()}>
                    <div>
                        {
                            iconsSVGs.placeholderImage
                        }

                        <p>Click to replace</p>
                        <p>SVG, PNG, JPG or GIF (max 1000 x 1000px)</p>

                        <input type={"file"} ref={storeLogoInputRef} style={{display: "none"}}  />
                    </div>
                </div>
            </div>
        </Accordion>

        <hr />

        <Accordion title={"Pharmacy Information"} >
            <div className={styles.forms}>
                <form>
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
                                    <input placeholder='Address 1' name="address_1" />
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>Address 2</label>
                                </td>

                                <td>
                                    <input placeholder='Address 2' name="address_2" />
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>State</label>
                                </td>

                                <td>
                                    <select defaultChecked={pharmacyDetails.state ? pharmacyDetails.state : "Abia"} defaultValue={pharmacyDetails.state ? pharmacyDetails.state : "Abia"}>
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
                                    <select>
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
                                    <button>Update Pharmacy Information</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </Accordion>

        <hr />

        <Accordion title={"Documentation"} >
            <div className={styles.documentation}>
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
                                {/* <p>Expired</p> */}
                            </td>

                            <td>
                                {/* <p>File name.jpg</p> */}
                            </td>

                            <td>
                                <button onClick={() => doc1InputRef.current.click()}>Update Document</button>
                                <input type={"file"} ref={doc1InputRef} style={{display : "none"}} />
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
                            </td>

                            <td>
                                {/* <p>File name.jpg</p> */}
                            </td>

                            <td>
                                <button onClick={() => doc2InputRef.current.click()}>Update Document</button>
                                <input type={"file"} ref={doc2InputRef} style={{display : "none"}} />
                            </td>
                        </tr>

                        <tr>
                            <td>
                            </td>

                            <td>
                            </td>

                            <td>

                            </td>

                            <td>
                                <button className={styles.button}>Update Documentation</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>


                    

                    

                    
                </div>

            </div>
        </Accordion>

        <hr />

        <Accordion title={"Bank Details"} >
        <div className={styles.forms}>
                <form onChange={event => verifyAccountDetails(event)}>
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
                                            banks.map((item, key) => <option key={item.id}>{item.name}</option>)
                                        }
                                    </select>
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    <label>Account Number</label>
                                </td>

                                <td>
                                    <input placeholder='Account Number' name='account_number' defaultValue={pharmacy?.bankDetails?.accountNumber} />
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>Account Name</label>
                                </td>

                                <td>
                                    <input disabled placeholder='Account Name' defaultValue={pharmacy?.bankDetails?.account_name} />
                                </td>
                            </tr>

                            <tr>
                                <td>

                                </td>

                                <td>
                                    <button>Update Bank Details</button>
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
                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label>Current Password</label>
                                </td>

                                <td>
                                <input placeholder='Current Password' />
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    <label>New Password</label>
                                </td>

                                <td>
                                    <input placeholder='New Password' />
                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <label>Confirm Password</label>
                                </td>

                                <td>
                                    <input placeholder='Confirm Password' />
                                </td>
                            </tr>

                            <tr>
                                <td>

                                </td>

                                <td>
                                    <button>Update Password</button>
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

