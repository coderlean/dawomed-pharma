import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useState } from 'react/cjs/react.development';
import Button from '../../components/atoms/Button';
import BankDetails from './components/bank-details';
import Documentation from './components/documentation';
import PharmacyInformation from './components/pharmacy-information';
import CreateAccountSideBar from './components/sidebar';
import Summary from './components/summary';
import caStyles from "./styles/styles.module.css";

const CreateAccount = (props) => {
    const [currentPharmacyDetails, setCurrentPharmacyDetails] = useState({
        pharmacyInformation: {
            state: "abia"
        },
        documentation: {

        },
        bankDetails: {

        }
    })
    const validSlugs = ["pharmacy-information","documentation", "bank-details", "summary"]
    console.log({currentPharmacyDetails});
    const pages = [
        {
            slug : "pharmacy-information",
            position: 1,
            component: <PharmacyInformation currentPharmacyDetails={currentPharmacyDetails} updatePharmacyDetails={(value, field) => {
                const temp = {...currentPharmacyDetails}

                temp.pharmacyInformation[String(field)] = value

                setCurrentPharmacyDetails(temp)
            }} />
        },
        {
            slug: "documentation",
            position: 2,
            component: <Documentation currentPharmacyDetails={currentPharmacyDetails} updatePharmacyDetails={(value, field) => {
                const temp = {...currentPharmacyDetails}

                temp.documentation[String(field)] = value

                setCurrentPharmacyDetails(temp)
            }}/>
        },
        {
            slug: "bank-details",
            position: 3,
            component: <BankDetails currentPharmacyDetails={currentPharmacyDetails} updatePharmacyDetails={(value, field) => {
                const temp = {...currentPharmacyDetails}

                temp.bankDetails[String(field)] = value

                setCurrentPharmacyDetails(temp)
            }} />
        },
        {
            slug: "summary",
            position: 4,
            component: <Summary currentPharmacyDetails={currentPharmacyDetails} />
        }
    ]

    const router = useRouter()
    const slug = router.query.slug

    useEffect(() => {
        if(slug !== undefined && !validSlugs.includes(slug)){
            router.push("/create-account")
        }

        
        var pharmacyCurrentDetails = {}

        if (router.query.pharmacyDetails){
            pharmacyCurrentDetails = JSON.parse(router.query.pharmacyDetails)
        }
        
        setCurrentPharmacyDetails({...currentPharmacyDetails, ...pharmacyCurrentDetails})
    }, [router.pathname])

    return  (
        <div className={[caStyles.caPagesContainer, "pageFixed displayFlex"].join(" ")}>
            <CreateAccountSideBar />

            <div className={caStyles.body}>
                <nav className='widthFull displayFlex jcEnd'>
                    <Link href={"/login"}>
                        <Button label={"LOG IN"} theme={"outline"} onClicked={() => router.push("/login")} />
                    </Link>
                </nav>
                {
                    pages.map(page => {
                        if(page.slug === slug){
                            return page.component
                        }
                    })
                }
            </div>

        </div>
    )
}

export default CreateAccount;