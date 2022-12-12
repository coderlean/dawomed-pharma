import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { iconsSVGs } from '../../../assets/images/icons';
import styles from "../styles/styles.module.css";
import SideBar from '../../../components/layouts/SideBar';
import DropDown from '../../../components/atoms/DropDown';
import Button from '../../../components/atoms/Button';
import TextInput from '../../../components/atoms/TextInput';
import dynamic from "next/dynamic";
import Image from 'next/image';
import scanSuccess from "../../../assets/images/scanSuccess.png";
import sampleQR from "../../../assets/images/sampleQR.png";
import { format } from 'date-fns';
import { plain_formatter } from './accountStatement';
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const getStatusStyle = (status) => {
    switch (status){
        case "used":
            return styles.returned
        default:
            return styles.completed
    }
}


const ReturnsOverview = ({returns}) => {
    const [slips, setSlips] = useState([])
    const [allSlips, setAllSlips] = useState([])
    const [allReturns, setAllReturns] = useState([])
    const [selectedSlip, setSelectedSlip] = useState({})
    const [slipID, setSlipID] = useState("")
    const [scanning, setScanning] = useState(false)
    const [scannedSlipDetails, setScannedSlipDetails] = useState({})

    useEffect(() => {
        setSlips(sampleOrders)
        setAllReturns(returns)

        const availableContraints = navigator.mediaDevices.getSupportedConstraints()
    }, [])

    const setCurrentTab = (currentTab) => {
        var tempOrders = allOrders
        tempOrders = tempOrders.filter(order => order.status.toLowerCase() === currentTab)
        setSlips(tempOrders)
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

                                <td className={styles.rightCell}>{selectedSlip.dateOrdered}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Customer Name:</td>

                                <td className={styles.rightCell}>{selectedSlip.customer.name}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Phone:</td>

                                <td className={styles.rightCell}>{selectedSlip.customer.phoneNumber}</td>
                            </tr>

                            <tr>
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
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Order Status:</td>

                                <td className={styles.rightCell}><span><label className={[styles.status, "m0", getStatusStyle(selectedSlip.status)].join(" ")}>{selectedSlip.status.slice(0,1).toUpperCase() + selectedSlip.status.slice(1)}</label></span></td>
                            </tr>

                            {
                                selectedSlip.deliveryMethod !== "Pick Up" && <>
                                <tr>
                                <td className={styles.leftCell}>Delivery Merchant:</td>

                                <td className={styles.rightCell}>{selectedSlip.deliveryMethod}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Delivery Address</td>

                                <td className={styles.rightCell}>{selectedSlip.deliveryAddress}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Delivery Fee:</td>

                                <td className={styles.rightCell}>{selectedSlip.deliveryFee}</td>
                            </tr>
                                </>
                            }

                            <tr>
                                <td className={styles.leftCell}>Price:</td>

                                <td className={styles.rightCell}>{selectedSlip.price}</td>
                            </tr>
                        </tbody>
                    </table>

                    <hr />

                    <table>
                        <tbody>
                        <tr>
                                <td className={styles.leftCell}>Total:</td>

                                <td className={styles.total}>{`N ${getTotal(selectedSlip)}`}</td>
                            </tr>
                        </tbody>
                    </table>

                    

                    
                </div>

                <footer className={["displayFlex alignCenter", styles.sidebarFooter].join(" ")}>
                        <DropDown options={["Pending", "Processing", "Completed", "Ready for Delivery/Pick up", "Cancelled", "Declined"]} placeholder={selectedSlip.status.slice(0,1).toUpperCase() + selectedSlip.status.slice(1)} defaultValue={selectedSlip.status.slice(0,1).toUpperCase() + selectedSlip.status.slice(1)} onChange={(e) => handleStatusChange(e)} />
                        <Button label={"Submit"} theme={"solid"} />
                    </footer>

                
            </SideBar>
            }

            <div className={[styles.searchDiv, 'displayFlex jcEnd pt20 pb20'].join(" ")}>
                <div className={[styles.search, "displayFlex alignCenter mr10"].join(" ")}>
                    <input placeholder='Search' />
                    {iconsSVGs.searchIconGrey}
                </div>

                <div className={[styles.sort, "displayFlex alignCenter mr10"].join(" ")}>
                    <p>Sort by: Recent</p>
                    {iconsSVGs.sortIconGrey}
                </div>

                <div className={[styles.filter, "displayFlex alignCenter"].join(" ")}>
                    <p>Filter by</p>
                    {iconsSVGs.filterIconGrey}
                </div>


            </div>

            <div className={[styles.productsTable]}>
                <table>
                    <tbody>
                        <tr className={styles.tableHeader}>
                            <td>ORDER N0.</td>
                            {/* <td>ITEM NAME</td> */}
                            <td>ORDER DATE</td>
                            <td>PAYMENT REF.</td>
                            <td>DATE RETURNED</td>
                            <td>REASON</td>
                            <td>REFUND AMOUNT</td>
                            <td>STATUS</td>
                            <td>ACTION</td>
                        </tr>

                        {
                            allReturns.map((item, index) => <OrderTableItem order={item.order_id} key={item.order_id._id} returns_data={item} setSelectedOrder={() => {
                                setScannedOrderDetails(order)
                                setSelectedOrder(order)
                            }} />)
                        }
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default ReturnsOverview

const order_statuses = ["Pending",
"Processing",
"Ready",
"Picked up",
"Delivered",
"Completed",
'Canceled' ,
"Returned"]

const OrderTableItem = ({ order, returns_data}) => {

    console.log({returns_data});

    return (
        <tr className={styles.orderTableItem}>
            <td className={styles.image}>
                <p>{order._id}</p>
            </td>

            <td>
                <p>{format(new Date(order.orderDate), "PPP")}</p>
            </td>

            <td>
                <p>{order.paymentRef}</p>
            </td>

            

            <td>
                <p>{returns_data.date_returned ? format(returns_data.date_returned, "PPP") : "Return pending"}</p>
            </td>

            <td>
                <p>{returns_data.reason}</p>
            </td>

            <td>
                <p>{plain_formatter.format(order.preDiscountedAmount)}</p>
            </td>

            {/* <td>
                <p>{plain_formatter.format(order.totalAmount - ((order.commission_percentage/100) * order.totalAmount))}</p>
            </td> */}

            <td>
                <p>{returns_data.status}</p>
            </td>

            {/* <td>
                <p>{(new Date(slip.dateActivated)).toLocaleDateString("en-NG")}</p>
            </td> */}

            {/* <td>
                <p className={[getStatusStyle(order_statuses[order.status]), styles.status].join(" ")}>{returns_data.status}</p>
            </td> */}

            <td>
                <a href={`/orders?id=${order._id}`} target="_blank" rel="noreferrer">
                    <button>View Order</button>
                </a>
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

]


