import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { iconsSVGs } from '../../assets/images/icons';
import LoggedInLayout from '../../components/layouts/LoggedInLayout/loggedinLayout';
import styles from "./styles/styles.module.css";
import SideBar from '../../components/layouts/SideBar';
import DropDown from '../../components/atoms/DropDown';
import Button from '../../components/atoms/Button';
import FileSelector from '../../components/molecules/FileSelector';
import TextInput from '../../components/atoms/TextInput';
import dynamic from "next/dynamic";
import Image from 'next/image';
import scanSuccess from "../../assets/images/scanSuccess.png";
import sampleQR from "../../assets/images/sampleQR.png";
import { postProtected } from '../../requests/postProtected';
import { getProtected } from '../../requests/getProtected';
import { formatter } from '../orders';
import { putProtected } from '../../requests/putProtected';
import ButtonLoader from '../../components/atoms/ButtonLoader';
import ErrorBox from '../../components/atoms/ErrorBox';
import TransparentLoader from '../../components/atoms/TransparentLoader';
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const getStatusStyle = (status) => {
    switch (status){
        case "Used":
            return styles.returned
        default:
            return styles.completed
    }
}


const PickUpSlip = () => {
    const [activeTab, setActiveTab] = useState("all")
    const [showNewProductModal, setShowNewProductModal] = useState(false)
    const [slips, setSlips] = useState([])
    const [allSlips, setAllSlips] = useState([])
    const [selectedSlip, setSelectedSlip] = useState({})
    const [slipID, setSlipID] = useState("")
    const [scanning, setScanning] = useState(false)
    const [scannedSlip, setSCannedSlip] = useState(null)
    const [scannedSlipDetails, setScannedSlipDetails] = useState({})
    const [updatingSlip, setUpdatingSlip] = useState(false)
    const [fetchingSlip, setFetchingSlip] = useState(false)
    const [searchQuery, setSearchQuery] = useState({
        queryString: "",
        searchBy: "",
        sortBy: "recent",
    })
    const [fetchSlipErrorMessage, setFetchSlipErrorMessage] = useState("")
    const [foundLabel, setFoundLabel] = useState("Order found!")
    const [fetchingSlips, setFetchingSlips] = useState(true)
    const [fetchedSlips, setFetchedSlips] = useState(false)

    useEffect(() => {
        fetchPickupSlips()

        const availableContraints = navigator.mediaDevices.getSupportedConstraints()
    }, [])

    const setCurrentTab = (currentTab) => {
        var tempOrders = allOrders
        tempOrders = tempOrders.filter(order => order.status.toLowerCase() === currentTab)
        setSlips(tempOrders)
    }

    const setTab = (activeTab) => {
        setActiveTab(activeTab)

        switch(activeTab){
            case "all":
                setSlips(allSlips)
                break;
            case "pending":
                setCurrentTab("pending")
                break;
            case "declined":
                setCurrentTab("declined")
                break;
            case "ready":
                setCurrentTab("ready")
                break;
            case "returns":
                setCurrentTab("returned")
                break;
            case "completed":
                    setCurrentTab("completed")
                    break;
        }

    }

    const closeSideBar = () => {
        let temp = selectedSlip
        temp = {}
        setSelectedSlip(temp)
        temp = scannedSlipDetails
        temp = {}
        setScannedSlipDetails(temp)
        setScanning(false)
        setSlipID("")
        
    }

    const getTotal = (selectedSlip) => {
        if (selectedSlip.deliveryMethod === "Pick Up"){
            return selectedSlip.price * selectedSlip.quantity
        } else {
            return (selectedSlip.price * selectedSlip.quantity) + selectedSlip.deliveryFee
        }
    }

    const filterActivated = () => {
        	var tempSlips = allSlips
            tempSlips = tempSlips.filter(slip => slip.status.toLowerCase() === "activated")
            setSlips(tempSlips)
    }

    const filterUsed = () => {
        var tempSlips = allSlips
        tempSlips = tempSlips.filter(slip => slip.status.toLowerCase() === "used")
        setSlips(tempSlips)
    }

    const fetchPickupSlips = async () => {
        try {
            setFetchingSlips(true)
            const pharmacyPickupSlips = await postProtected("pickup-slips/pharmacy")
            setFetchingSlips(false)
            setFetchedSlips(true)

            if (pharmacyPickupSlips && pharmacyPickupSlips.status && pharmacyPickupSlips.status === "OK") {
                const temp = [...slips]
                temp = pharmacyPickupSlips.data
                setSlips(temp)

                temp = [...allSlips]
                temp = pharmacyPickupSlips.data
                setAllSlips(temp)
            }

            console.log({pharmacyPickupSlips});
        } catch (error) {
            console.log({error});
        }
    }

    const updatePickupSlipStatus = async () => {
        try {
            setUpdatingSlip(true)
            const updatePickupSlipStatus = await putProtected(`pickup-slips/${selectedSlip._id}`)

            setUpdatingSlip(false)
            if (updatePickupSlipStatus.slip && updatePickupSlipStatus?.slip?._id) {
                console.log("Slip updated");
                let temp = [...slips]
                temp = temp.map((item) => {
                    if (item._id === updatePickupSlipStatus?.slip?._id) {
                        console.log("Matched");
                        item["status"] = "Used"
                    }
                    return item
                })
                setSlips(temp)
            }
        } catch (error) {
            console.log({error});
        }
    }

    const completeOrder = async (slipID) => {
        try {
            const completeOrder = await putProtected(`pickup-slips/pharmacy/completeOrder/${slipID}`)

            console.log({completeOrder});

            if (completeOrder && completeOrder.status && completeOrder.status === "OK") {
                let temp = {...scannedSlip}
                temp = completeOrder.data
                setSCannedSlip(temp)

                setSlipID(completeOrder._id)
                setFoundLabel("Customer has picked up order. Order has been marked as completed.")
                fetchPickupSlips()
            } else if (completeOrder && completeOrder.status && completeOrder.status === "FAILED") {
                setFetchingSlip(false)
                setFetchSlipErrorMessage(completeOrder.error.message)
            }
        } catch (error) {
            console.log({error});
        }
    }

    const fetchSlip = async (result) => {
        console.log("feytching slip");
        
        try {
            if (typeof result === "string") {
                setFetchingSlip(true)
                const slipResult = await getProtected(`pickup-slips/${result}`)
                console.log({slipResult});
                setFetchingSlip(false)

                console.log(slipResult.status, slipResult.deliveryOption);

                if (slipResult.status === "Activated" && slipResult.deliveryOption === "Pick Up") {
                    completeOrder(slipResult._id)
                } else {
                    let temp = {...scannedSlip}
                temp = slipResult
                setSCannedSlip(temp)

                setSlipID(slipResult._id)
                setFoundLabel("Order found!")
                }


                
            }
        } catch (error) {
            console.log({error});
        }
    }

    const getPickupSlipByID = event => {
        event.preventDefault()
        const slipIDString = event.target[0].value
        fetchSlip(slipIDString)
    }

    const updateSearchQuery = (event) => {
        const field = event.target.name
        const value = event.target.value

        let temp = {...searchQuery}
        temp[field] = value
        setSearchQuery(temp)
    }

    const submitSearch = async event => {
        event.preventDefault()

        setFetchingSlips(true)
        
        const searchSlipRequest = await postProtected(`pickup-slips/pharmacy/search`, searchQuery)

        setFetchingSlips(false)

        console.log({searchSlipRequest});


        if (searchSlipRequest && searchSlipRequest.status && searchSlipRequest.status === "OK") {

            let temp = [...slips]
            temp = searchSlipRequest.data
            setSlips(temp)

        }
    }


    return (
        <div className={styles.orders}>
            {
                (Object.entries(selectedSlip).length > 0) && <SideBar closeSideBar={() => closeSideBar()}>
                <h1 className={styles.sidebarTitle}>Order Details</h1>

                <div className={styles.sidebarIcons}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5.99992V1.33325H12V5.99992" stroke="white" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.99967 12H2.66634C2.31272 12 1.97358 11.8595 1.72353 11.6095C1.47348 11.3594 1.33301 11.0203 1.33301 10.6667V7.33333C1.33301 6.97971 1.47348 6.64057 1.72353 6.39052C1.97358 6.14048 2.31272 6 2.66634 6H13.333C13.6866 6 14.0258 6.14048 14.2758 6.39052C14.5259 6.64057 14.6663 6.97971 14.6663 7.33333V10.6667C14.6663 11.0203 14.5259 11.3594 14.2758 11.6095C14.0258 11.8595 13.6866 12 13.333 12H11.9997" stroke="white" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 9.33325H4V14.6666H12V9.33325Z" stroke="white" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                <div className={styles.sidebarContent}>
                    <table>
                        <tbody>
                            <tr>
                                <td className={styles.leftCell}>Order No:</td>

                                <td className={styles.rightCell}>{selectedSlip._id}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Order Date:</td>

                                <td className={styles.rightCell}>{(new Date(selectedSlip?.createdDate)).toLocaleDateString("en-NG")}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Customer Name:</td>

                                <td className={styles.rightCell}>{`${selectedSlip?.orderId?.customerDetails?.contact_details.first_name} ${selectedSlip?.orderId?.customerDetails?.contact_details.last_name}`}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Phone:</td>

                                <td className={styles.rightCell}>{selectedSlip?.customerID?.phone_number}</td>
                            </tr>

                            {/* <tr>
                                <td className={styles.leftCell}>Payment Method:</td>

                                <td className={styles.rightCell}>{selectedSlip.paymentMethod}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Item Name:</td>

                                <td className={styles.rightCell}>{selectedSlip.itemName}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Quantity:</td>

                                <td className={styles.rightCell}>{selectedSlip.quantity}</td>
                            </tr> */}

                            {/* <tr>
                                <td className={styles.leftCell}>Slip Status:</td>

                                <td className={styles.rightCell}><span><label className={[styles.status, "m0", getStatusStyle(selectedSlip.status)].join(" ")}>{selectedSlip.status.slice(0,1).toUpperCase() + selectedSlip.status.slice(1)}</label></span></td>
                            </tr> */}

                            {
                            //     selectedSlip.deliveryMethod !== "Pick Up" && <>
                            //     <tr>
                            //     <td className={styles.leftCell}>Delivery Merchant:</td>

                            //     <td className={styles.rightCell}>{selectedSlip.deliveryMethod}</td>
                            // </tr>

                            // <tr>
                            //     <td className={styles.leftCell}>Delivery Address</td>

                            //     <td className={styles.rightCell}>{selectedSlip.deliveryAddress}</td>
                            // </tr>

                            // <tr>
                            //     <td className={styles.leftCell}>Delivery Fee:</td>

                            //     <td className={styles.rightCell}>{selectedSlip.deliveryFee}</td>
                            // </tr>
                            //     </>
                            }

                            <tr>
                                <td className={styles.leftCell}>Price:</td>

                                <td className={styles.rightCell}>{selectedSlip.price}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Items Ordered:</td>

                                <td className={styles.rightCell}>
                                    <table className={styles.productsTable}>
                                        <thead>
                                            <tr>
                                                <td>
                                                    Name
                                                </td>

                                                <td>
                                                    Quantity
                                                </td>

                                                <td>
                                                    Price 
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                selectedSlip?.orderId?.products.map((item, index) => <tr key={index}>

                                                    <td>
                                                        {item?.productId?.name}
                                                    </td>

                                                    <td>
                                                        {item.quantity_requested}
                                                    </td>

                                                    <td>
                                                        {formatter.format(item.productId.price)}
                                                    </td>


                                                </tr>)
                                            }
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <hr />

                    <table>
                        <tbody>
                        <tr>
                                <td className={styles.leftCell}>Total:</td>

                                <td className={styles.total}>{`${formatter.format(selectedSlip.orderId.totalAmount)}`}</td>
                            </tr>
                        </tbody>
                    </table>

                    

                    
                </div>

                <footer className={["displayFlex alignCenter", styles.sidebarFooter].join(" ")}>
                        {/* <DropDown options={["Pending", "Processing", "Completed", "Ready for Delivery/Pick up", "Cancelled", "Declined"]} placeholder={selectedSlip.status.slice(0,1).toUpperCase() + selectedSlip.status.slice(1)} defaultValue={selectedSlip.status.slice(0,1).toUpperCase() + selectedSlip.status.slice(1)} onChange={(e) => handleStatusChange(e)} /> */}
                        {/* <Button onButtonClick={() => updatePickupSlipStatus()} label={"Set As Used"} theme={"solid"} /> */}

                        {/* {
                            selectedSlip.status === "Activated" && <button disabled={updatingSlip} onClick={() => updatePickupSlipStatus()} className={styles.updateButton}>SET AS USED
                            {
                            updatingSlip && <ButtonLoader />
                            }
                            </button>
                        } */}
                </footer>

                
            </SideBar>
            }

            <Head>
                <title>Products | MedUp</title>
            </Head>

            {
            (Object.entries(selectedSlip).length === 0 && scanning) &&
            <SideBar closeSideBar={() => {
                closeSideBar()
            }}>
                <div>Scan QR Code</div>
                <div></div>

                <div className={styles.scanSideBar}>
                    {Object.entries(scannedSlipDetails).length === 0 && <React.Fragment>
                        <div className={styles.sidebarContainer}>
                            <div className='displayFlex jcSpaceBetween font14 greyLabelText'>
                                <p>QR Code scan by webcam</p>
                                <p>Enable systems camera</p>
                            </div>

                            {
                                fetchSlipErrorMessage && <ErrorBox closeErrorBox={() => {setFetchSlipErrorMessage("")}} errorMessage={fetchSlipErrorMessage} />
                            }

                            <div className='displayFlex jcCenter'>
                                {
                                    slipID !== "" && <Image src={scanSuccess} />
                                }

                                {
                                    slipID === "" && !fetchSlipErrorMessage && !fetchingSlip &&                         <QrReader 
                                    onResult={(result, error) => {
                                        if (!!result) {
                                            console.log({result});
                                        }

                                        if (!!error) {
                                            console.info(error);
                                        }
                                    }}

                                    onScan={(result) => {
                                        console.log({result});
                                        if (result){
                                            fetchSlip(result)
                                        }
                                    }}

                                    onError={error => {
                                        console.log({error});
                                    }}

                                    facingMode={'user'}
                                    style={{ width: '50%', marginBottom: "10px" }} 
                                />
                                }
                            </div>

                            <div className={styles.scanButton}>
                                {
                                    slipID === "" && !fetchSlipErrorMessage  && <div className="posRelative">
                                    <div className={styles.buttonOverlay}></div>
                                    <Button disabled={true} label={"Scanning"} theme={"solid"} leftIcon={iconsSVGs.qrCodeWhite} />
                                    </div>
                                }

                                {
                                    slipID !== "" && 
                                    <React.Fragment>

                                        <div>
                                            <p className={styles.foundLabel}>{foundLabel}</p>
                                        <p className={styles.slipID}>{slipID}</p>

                                        <div className={['displayFlex', styles.actionButtons].join(" ")}>
                                        <div className={styles.rescanButton}>
                                            <Button disabled={false} 
                                                onButtonClick={()=> {
                                                    setSlipID("")
                                                }} label={"Scan Again"} 
                                                theme={"outline"} 
                                                leftIcon={iconsSVGs.qrCodePrimary} 
                                            />
                                        </div>



                                        <Button disabled={false} 
                                            onButtonClick={() => {
                                                // const temp = {...scannedSlipDetails}
                                                // temp = scannedSlip
                                                // setScannedSlipDetails(temp)
                                                setScanning(false)
                                                let temp = {...selectedSlip}
                                                temp = scannedSlip
                                                setSelectedSlip(temp)
                                                setSlipID("")
                                                temp = {...scannedSlip}
                                                temp = {}
                                                setSCannedSlip(temp)
                                            }} 
                                            label={"View Details"} 
                                            theme={"solid"} 
                                        />

                                        </div>
                                        </div>
                                        
                                    </React.Fragment>
                                }



{
                                    fetchSlipErrorMessage !== "" && 
                                    <React.Fragment>

                                        <div>
                                        <p className={styles.slipID}>{slipID}</p>

                                        <div className={['displayFlex', styles.actionButtons].join(" ")}>
                                        <div className={styles.rescanButton}>
                                            <Button disabled={false} 
                                                onButtonClick={()=> {
                                                    setSlipID("")
                                                    setFetchSlipErrorMessage("")
                                                }} label={"Scan Again"} 
                                                theme={"outline"} 
                                                leftIcon={iconsSVGs.qrCodePrimary} 
                                            />
                                        </div>



                                        </div>
                                        </div>
                                        
                                    </React.Fragment>
                                }

                            </div>

                        </div>

                        <hr />

                        <div className={styles.sidebarContainer}>
                                <table className='widthFull'>
                                    <tbody>
                                        {/* 
                                        <tr>
                                            <td><p className='font14'>QR option</p></td>
                                            <td className='pl20'>
                                                <p className='m0 font12 greyLabelText mb5'>Upload QR from my computer</p>
                                                <FileSelector />
                                            </td>
                                        </tr> */}

                                        <tr >
                                            <td className='pl20'>
                                                <form onSubmit={event => getPickupSlipByID(event)}>
                                                    <p className='m0 font12 greyLabelText mb5 pt20'>Enter the eight (8) digit code on your pickup slip</p>
                                                    <TextInput  max={999999999} placeholder="Pickup slip number" />

                                                    <button>Get Slip
                                                        {
                                                            fetchingSlip && <ButtonLoader />
                                                        }
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                        </div>
                        </React.Fragment>
                    }

                    {
                        Object.entries(scannedSlipDetails).length !== 0 && <React.Fragment>
                        <div className='displayFlex alignCenter jcSpaceBetween pl20 pr20 pt20'>
                            <Image src={sampleQR} />

                            <Button disabled={false} onClicked={()=> {
                                setSlipID("")
                                setScannedSlipDetails({})
                            }} 
                            label={"Scan Again"} 
                            theme={"solid"} 
                            leftIcon={iconsSVGs.qrCodeWhite} 
                            />
                            
                        </div>

                        <p className='pl20 font18 fw600'>Item Order Details</p>

                        <div className='displayFlex alignCenter jcSpaceBetween pl20 pr20'>
                            <p className='mt10 mb10 fw500'>Name of item</p>
                            <p className='mt10 mb10 greyLabelText'>Item name</p>
                        </div>

                        <div className='displayFlex alignCenter jcSpaceBetween pl20 pr20'>
                            <p className='mt10 mb10 fw500'>Product image</p>
                        </div>

                        <div className='displayFlex alignCenter jcSpaceBetween pl20 pr20'>
                            <p className='mt10 mb10 fw500'>Payment Status</p>
                            <p className='mt10 mb10 greyLabelText'>Paid</p>
                        </div>

                        <div className='displayFlex alignCenter jcSpaceBetween pl20 pr20'>
                            <p className='mt10 mb10 fw500'>Price</p>
                            <p className='mt10 mb10 greyLabelText'>N25000</p>
                        </div>

                        <div className='displayFlex alignCenter jcSpaceBetween pl20 pr20'>
                            <p className='mt10 mb10 fw500'>Quantity</p>
                            <p className='mt10 mb10 greyLabelText'>2</p>
                        </div>

                        <div className='displayFlex alignCenter jcSpaceBetween pl20 pr20'>
                            <p className='mt10 mb10 fw500'>Coupon</p>
                            <p className='mt10 mb10 greyLabelText'>2%</p>
                        </div>

                        <hr />

                        <div className='displayFlex alignCenter jcSpaceBetween pl20 pr20'>
                            <p className='mt10 mb10 fw500'>Total</p>
                            <p className='mt10 mb10 fw500'>N25000</p>
                        </div>

                        <div className='displayFlex alignCenter jcSpaceBetween pl20 pr20'>
                            <DropDown defaultValue={"Pending"} options={[]} />
                            <Button label={"Submit"} theme="solid" />
                        </div>
                        </React.Fragment>
                    }
                </div>
            </SideBar>
        }


            
            <header className='displayFlex'>


                <div className={[styles.headerTabs, 'displayFlex'].join("  ")}>
                    <p className={activeTab === "all" ? styles.active : styles.inactive} onClick={() => setTab("all")}>All Orders</p>

                    <p className={activeTab === "activated" ? styles.active : styles.inactive} onClick={() => {
                        setTab("activated")
                        filterActivated()
                    }}>Activated</p>

                    <p className={activeTab === "used" ? styles.active : styles.inactive} onClick={() => {
                        setTab("used")
                        filterUsed()
                    }}>Used</p>
                </div>
            </header>

            <div className={[styles.searchDiv, 'displayFlex jcEnd pt20 pb20'].join(" ")}>
                <form className={styles.searchSlipsForm} onSubmit={event => submitSearch(event)} onChange={event => updateSearchQuery(event)}>
                    <div className={[styles.search, "displayFlex alignCenter mr10"].join(" ")}>
                        <input placeholder='Search' name='queryString' />
                        <select name='searchBy'>
                            <option value={"all"}>All</option>
                            <option value={"id"}>Slip ID</option>
                            <option value={"code"}>Redemption Code</option>
                            <option value={"name"}>Customer Name</option>
                        </select>

                        {iconsSVGs.searchIconGrey}
                    </div>

                    <div className={[styles.sort, "displayFlex alignCenter mr10"].join(" ")}>
                        <p>Sort by:</p>
                        <select name='sortBy'>
                            <option value={"recent"}>Recent</option>
                            <option value={"oldest"}>Oldest</option>
                        </select>
                        {iconsSVGs.sortIconGrey}
                    </div>

                    {/* <div className={[styles.filter, "displayFlex alignCenter"].join(" ")}>
                        <p>Filter by</p>
                        {iconsSVGs.filterIconGrey}
                    </div> */}

                    <Button label={"Search"} theme={"solid"} leftIcon={iconsSVGs.searchIconWhite} />

                    <Button label={"Scan Code"} onButtonClick={() => {
                        console.log("scanning");
                        setScanning(true)
                        // setScannedSlipDetails({})
                    }} theme={"solid"} leftIcon={iconsSVGs.qrCodeWhite} />
                </form>
            </div>

            <div className={[styles.productsTable]}>
                <table>
                    <tbody>
                        <tr className={styles.tableHeader}>
                            <td>SLIP ID</td>
                            
                            <td>CUSTOMER</td>
                            <td>DATE GENERATED</td>
                            <td>STATUS</td>
                            {/* <td>DATE ACTIVATED</td> */}
                            <td>ACTION</td>
                        </tr>

                        {
                            slips.map((slip, index) => <OrderTableItem slip={slip} key={slip._id} setSelectedSlip={() => {
                                setScannedSlipDetails(slip)
                                setSelectedSlip(slip)
                            }} />)
                        }
                    </tbody>
                </table>
            </div>

            {
                fetchingSlips && <TransparentLoader />
            }

{
                    (fetchedSlips && slips.length === 0) && <div className={styles.noProductsDiv}>

                        <h4 style={{marginTop: "40px"}}>No Pickup Slips Yet.</h4>
                        <p>Pickup slips for created orders would be listed here.</p>

                        <div className={styles.addProductsButtonsContainer}>

                    </div>

        
                    </div>
                }

        </div>
    )
}

PickUpSlip.getLayout = function getLayout (page) {
    return <LoggedInLayout>
        {page}
    </LoggedInLayout>
}


export default PickUpSlip

const OrderTableItem = ({ slip, setSelectedSlip }) => {
    return (
        <tr className={styles.orderTableItem}>
            <td className={styles.image}>
                <p>{slip?._id}</p>
            </td>

            <td>
                <p>{`${slip?.orderId?.customerDetails?.contact_details.first_name} ${slip?.orderId?.customerDetails?.contact_details.last_name}`}</p>
            </td>

            <td>
                <p>{(new Date(slip.createdDate)).toLocaleDateString("en-NG")}</p>
            </td>

            <td>
                <p className={[getStatusStyle(slip.status), styles.status].join(" ")}>{slip.status.slice(0,1).toUpperCase() + slip.status.slice(1)}</p>
            </td>

            {/* <td>
                <p>{slip.dateActivated ? (new Date(slip.dateActivated)).toLocaleDateString("en-NG") : "-"}</p>
            </td> */}

            <td>
                <button onClick={() => setSelectedSlip(slip)}>View Details</button>
            </td>



            
        </tr>
    )
}

const sampleOrders = [
    {
        _id: 1,
        customer: {
            name: "John Doe",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateGenerated : Date.now(),
        dateActivated : Date.now(),
        status: "activated",
    },

    {
        _id: 2,
        customer: {
            name: "Chioma Jesus",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateGenerated : Date.now(),
        dateActivated : Date.now(),
        status: "activated",
    },

    {
        _id: 3,
        customer: {
            name: "Abdulkadir Ahmed",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateGenerated : Date.now(),
        dateActivated : Date.now(),
        status: "used",
    },

    {
        _id: 4,
        customer: {
            name: "Bunmi Adeosun",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateGenerated : Date.now(),
        dateActivated : Date.now(),
        status: "activated",
    },

    {
        _id: 5,
        customer: {
            name: "Tara Holmes",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateGenerated : Date.now(),
        dateActivated : Date.now(),
        status: "used",
    },

    {
        _id: 6,
        customer: {
            name: "Tara Holmes",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateGenerated : Date.now(),
        dateActivated : Date.now(),
        status: "used",
    },

    // {
    //     itemName: "Lonart DS",
    //     quantity: 2,
    //     discountPercentage: 10,
    //     category: "Antimalarial",
    //     brand: "Emzor",
    //     price: 2250,
    //     prescription: false,
    //     rating: 3,
    //     _id: 5,
    //     customer: {
    //         name: "Kenny Laja",
    //         phoneNumber: "08104898400",
    //         deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
    //     },
    //     dateOrdered : Date.now(),
    //     deliveryMethod : "Pick Up",
    //     status: "processing",
    //     deliveryDate: Date.now(),
    //     paymentMethod: "Debit Card",
    //     paymentMerchant: "Visa",
    //     deliveryFee: 1500
    // },


]


