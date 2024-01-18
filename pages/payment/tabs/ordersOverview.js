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
import { postProtected } from '../../../requests/postProtected';
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const getStatusStyle = (status) => {
    switch (status){
        case "Pending":
            return styles.pending
        case "Processing":
            return styles.processing
        case "Canceled":
            return styles.declined
        case "Returned":
            return styles.returned
        case "Ready":
            return styles.readyForDelivery
        case "Picked Up":
            return styles.readyForPickup
        default:
            return styles.completed
    }
}


const OrdersOverview = ({allOrders}) => {
    console.log({allOrders});

    const [allSlips, setAllSlips] = useState([])
    const [selectedOrder, setSelectedOrder] = useState({})
    const [scannedOrderDetails, setScannedOrderDetails] = useState({})
    const [searchQuery, setSearchQuery] = useState({
        query: "",
        searchBy: "",
        orderBy: "newest"
    })
    const [orders, setOrders] = useState([])

    useEffect(() => {

        setOrders(allOrders)
        const availableContraints = navigator.mediaDevices.getSupportedConstraints()
    }, [allOrders])

    const setCurrentTab = (currentTab) => {
        var tempOrders = allOrders
        tempOrders = tempOrders.filter(order => order.status.toLowerCase() === currentTab)
        setOrders(tempOrders)
    }



    const closeSideBar = () => {
        let temp = selectedOrder
        temp = {}
        setSelectedOrder(temp)
        temp = scannedOrderDetails
        temp = {}
        setScannedOrderDetails(temp)
        setScanning(false)
        setSlipID("")
        
    }

    const getTotal = (selectedOrder) => {
        if (selectedOrder.deliveryMethod === "Pick Up"){
            return selectedOrder.price * selectedOrder.quantity
        } else {
            return (selectedOrder.price * selectedOrder.quantity) + selectedOrder.deliveryFee
        }
    }

    const filterActivated = () => {
        	var tempSlips = allSlips
            tempSlips = tempSlips.filter(slip => slip.status.toLowerCase() === "activated")
            setOrders(tempSlips)
    }

    const filterUsed = () => {
        var tempSlips = allSlips
        tempSlips = tempSlips.filter(slip => slip.status.toLowerCase() === "used")
        setOrders(tempSlips)
    }

    const updateSearchDetails = event => {
        const field = event.target.name
        const value = event.target.value

        let temp = {...searchQuery}
        temp[field] = value
        setSearchQuery(temp)
    }

    const searchOrders = async event => {
        try {
            event.preventDefault()

        const searchOrdersRequest = await postProtected(`orders/search/pharmacy`, searchQuery)

        console.log({searchOrdersRequest});

        if (searchOrdersRequest && searchOrdersRequest.status === "OK") {
            let temp = {...orders}
            temp = searchOrdersRequest.data
            setOrders(temp)
        }
        } catch (error) {
            console.log({error});
        }

    }


    return (
        <div className={styles.orders}>
            {
                (Object.entries(selectedOrder).length > 0) && <SideBar closeSideBar={() => closeSideBar()}>
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

                                <td className={styles.rightCell}>{selectedOrder._id}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Order Date:</td>

                                <td className={styles.rightCell}>{selectedOrder.dateOrdered}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Customer Name:</td>

                                <td className={styles.rightCell}>{selectedOrder.customer.name}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Phone:</td>

                                <td className={styles.rightCell}>{selectedOrder.customer.phoneNumber}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Payment Method:</td>

                                <td className={styles.rightCell}>{selectedOrder.paymentMethod}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Item Name:</td>

                                <td className={styles.rightCell}>{selectedOrder.itemName}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Quantity:</td>

                                <td className={styles.rightCell}>{selectedOrder.quantity}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Order Status:</td>

                                <td className={styles.rightCell}><span><label className={[styles.status, "m0", getStatusStyle(selectedOrder.status)].join(" ")}>{selectedOrder.status.slice(0,1).toUpperCase() + selectedOrder.status.slice(1)}</label></span></td>
                            </tr>

                            {
                                selectedOrder.deliveryMethod !== "Pick Up" && <>
                                <tr>
                                <td className={styles.leftCell}>Delivery Merchant:</td>

                                <td className={styles.rightCell}>{selectedOrder.deliveryMethod}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Delivery Address</td>

                                <td className={styles.rightCell}>{selectedOrder.deliveryAddress}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Delivery Fee:</td>

                                <td className={styles.rightCell}>{selectedOrder.deliveryFee}</td>
                            </tr>
                                </>
                            }

                            <tr>
                                <td className={styles.leftCell}>Price:</td>

                                <td className={styles.rightCell}>{selectedOrder.price}</td>
                            </tr>
                        </tbody>
                    </table>

                    <hr />

                    <table>
                        <tbody>
                        <tr>
                                <td className={styles.leftCell}>Total:</td>

                                <td className={styles.total}>{`N ${getTotal(selectedOrder)}`}</td>
                            </tr>
                        </tbody>
                    </table>

                    

                    
                </div>

                <footer className={["displayFlex alignCenter", styles.sidebarFooter].join(" ")}>
                        <DropDown options={["Pending", "Processing", "Completed", "Ready for Delivery/Pick up", "Cancelled", "Declined"]} placeholder={selectedOrder.status.slice(0,1).toUpperCase() + selectedOrder.status.slice(1)} defaultValue={selectedOrder.status.slice(0,1).toUpperCase() + selectedOrder.status.slice(1)} onChange={(e) => handleStatusChange(e)} />
                        <Button label={"Submit"} theme={"solid"} />
                    </footer>

                
            </SideBar>
            }



<form className={styles.searchForm} onChange={event => updateSearchDetails(event)} onSubmit={event => searchOrders(event)}>
            <div className={[styles.searchDiv, 'displayFlex jcEnd pt20 pb20'].join(" ")}>
                <div className={[styles.search, "displayFlex alignCenter mr10"].join(" ")}>
                    <input placeholder='Search' name='query' />
                    <select className={styles.searchList} name="searchBy">
                        <option value={""}>All</option>
                        <option value={"id"}>Order ID</option>
                        <option value={"name"}>Customer Name</option>
                        <option value={"email"}>Customer Email</option>
                    </select>
                    {iconsSVGs.searchIconGrey}
                </div>

                <div className={[styles.sort, "displayFlex alignCenter mr10"].join(" ")}>
                    <p>Sort by: Recent</p>
                    <select className={styles.searchList} name="orderBy">
                        <option value={"newest"}>Newest</option>
                        <option value={"oldest"}>Oldest</option>
                        <option value={"lowest"}>Lowest Amount</option> 
                        <option value={"highest"}>Highest Amount</option>

                    </select>
                    {iconsSVGs.sortIconGrey}
                </div>

                {/* <div className={[styles.filter, "displayFlex alignCenter"].join(" ")}>
                    <p>Filter by</p>
                    {iconsSVGs.filterIconGrey}
                </div> */}

                <Button label={"Search"} />
            </div>
            </form>

            <div className={[styles.productsTable]}>
                <table>
                    <tbody>
                        <tr className={styles.tableHeader}>
                            <td>ORDER N0.</td>
                            {/* <td>ITEM NAME</td> */}
                            <td>ORDER CONF. DATE</td>
                            <td>PAYMENT REF.</td>
                            <td>PERCENTAGE (%)</td>
                            <td>COMMISSION</td>
                            <td>GROSS AMOUNT</td>
                            <td>NET AMOUNT</td>
                            <td>STATUS</td>
                            <td>ACTION</td>
                        </tr>

                        {
                            orders.map((order, index) => <OrderTableItem order={order} key={order.order_id} setSelectedOrder={() => {
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

export default OrdersOverview


const order_statuses = ["Pending",
    "Processing",
    "Ready",
    "Picked up",
    "Delivered",
    "Completed",
    'Canceled' ,
    "Returned",
    "Canceled"
]

const OrderTableItem = ({ order, setSelectedOrder }) => {
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
                <p>{order.commission_percentage ? order.commission_percentage : 0}</p>
            </td>

            <td>
                <p>{(order.commission_percentage/100) * order.totalAmount}</p>
            </td>

            <td>
                <p>{plain_formatter.format(order.preDiscountedAmount)}</p>
            </td>

            <td>
                <p>{plain_formatter.format(order.totalAmount - ((order.commission_percentage/100) * order.totalAmount))}</p>
            </td>

            {/* <td>
                <p>{order.product_name}</p>
            </td> */}

            {/* <td>
                <p>{(new Date(slip.dateActivated)).toLocaleDateString("en-NG")}</p>
            </td> */}

            <td>
                <p className={[getStatusStyle(order_statuses[order.status]), styles.status].join(" ")}>{order_statuses[order.status]}</p>
            </td>

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
        order_id: 1,
        order_conf_date: "20/02/2022",
        product_name : "Emzor Paracetamol",
        product_sku : "PD234433",
        sales: 10000,
        percentage: 2,
        payout_status: "Paid",
        customer: {
            name: "John Doe"
        },
        status: "pending"
    },

    {
        order_id: 2,
        order_conf_date: "20/12/2022",
        product_name : "Amoxicilin",
        product_sku : "RSD23453",
        sales: 25000,
        percentage: 3,
        payout_status: "Pending",
    },

    {
        order_id: 3,
        order_conf_date: "13/01/2021",
        product_name : "Lincomycin",
        product_sku : "TI2045433",
        sales: 43200,
        percentage: 5,
        payout_status: "Paid",
    },

    {
        order_id: 4,
        order_conf_date: "20/02/2022",
        product_name : "Emzor Paracetamol",
        product_sku : "PD234433",
        sales: 10000,
        percentage: 2,
        payout_status: "Paid",
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


