import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { iconsSVGs } from '../../assets/images/icons';
import LoggedInLayout from '../../components/layouts/LoggedInLayout/loggedinLayout';
import styles from "./styles/styles.module.css";
import SideBar from '../../components/layouts/SideBar';
import DropDown from '../../components/atoms/DropDown';
import Button from '../../components/atoms/Button';
import { getProtected } from '../../requests/getProtected';
import {format} from "date-fns"
import TransparentLoader from '../../components/atoms/TransparentLoader';
import { postProtected } from '../../requests/postProtected';
import { putProtected } from '../../requests/putProtected';
import { useRouter } from 'next/router';
import ErrorBox from '../../components/atoms/ErrorBox';
import SuccessBox from '../../components/atoms/SuccessBox';

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

export const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  const orderStatusMapping = {
    pending : 0,
    processing : 1,
    ready : 2,
    picked_up : 3,
    delivered : 4,
    completed: 5,
    canceled : 6,
    returned : 7
  }

  const order_statuses = ["Pending",
    "Processing",
    "Ready",
    "Picked up",
    "Delivered",
    "Completed",
    'Canceled' ,
    "Returned"]


const Products = () => {
    const [activeTab, setActiveTab] = useState("all")
    const [showNewProductModal, setShowNewProductModal] = useState(false)
    const [orders, setOrders] = useState([])
    const [allOrders, setAllOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState({})
    const [fetchingOrders, setFetchingOrders] = useState(true)
    const [newStatus, setNewStatus] = useState("")
    const router = useRouter()
    const [sidebar_error, set_sidebar_error] = useState("")
    const [sidebar_success, set_sidebar_success] = useState("")
    const [updating_status, set_updating_status] = useState(false)

   


    useEffect(() => {
        if (router?.query?.id) {
            getOrder(router?.query?.id)
        }
        
    }, [router])

    const getOrder = async (id) => {
        try {
           const order = await getProtected(`orders/${id}`) 

           if (order && order.status && order.status === "OK") {
            let temp = {...selectedOrder}
            temp = order.data
            setSelectedOrder(temp)
           }

           console.log({order});
        } catch (error) {
            console.log({error});
        }
    }


    const orderStatuses = ["pending", "processing", "completed", "ready", "cancelled", "declined", "returned"]

    useEffect(() => {
        fetchOrders()
    }, [])

    const getFormattedDate = orderDate => {

        const date = new Date(orderDate)

        return format(date, "PP")
    }

    const setCurrentTab = (currentTab) => {
        var tempOrders = allOrders
        tempOrders = tempOrders.filter(order => String(order_statuses[order.status]).toLowerCase() === currentTab)
        setOrders(tempOrders)
    }

    const fetchOrders = async () => {
        setFetchingOrders(true)
        const pharmacy = JSON.parse(localStorage.getItem("user"))
        console.log({pharmacy});
        try {
            const ordersList = await getProtected(`orders/pharmacy/all/${pharmacy._id}`)

            setFetchingOrders(false)

            console.log({ordersList});

            setOrders(ordersList.data)
            setAllOrders(ordersList.data)
        } catch (error) {
            console.log(error);
        }
    }

    const setTab = (activeTab) => {
        setActiveTab(activeTab)

        switch(activeTab){
            case "all":
                setOrders(allOrders)
                break;
            case "pending":
                setCurrentTab("pending")
                break;
            case "canceled":
                setCurrentTab("canceled")
                break;
                case "processing":
                setCurrentTab("processing")
                break;
            case "ready":
                setCurrentTab("ready")
                break;
                case "picked up":
                setCurrentTab("picked up")
                break;
                case "delivered":
                setCurrentTab("delivered")
                break;
            case "returned":
                setCurrentTab("returned")
                break;
            case "completed":
                    setCurrentTab("completed")
                    break;
        }

    }

    const closeSideBar = () => {
        let temp = selectedOrder
        temp = {}
        setSelectedOrder(temp)
    }

    const getTotal = (selectedOrder) => {
        if (selectedOrder.deliveryMethod === "Pick Up"){
            return selectedOrder.price * selectedOrder.quantity
        } else {
            return (selectedOrder.price * selectedOrder.quantity) + selectedOrder.deliveryFee
        }
    }

    const handleStatusChange = e => {
        setNewStatus(e.target.value)
    }

    const saveNewStatus = e => {
        try {
            const saveNewStatusRequest = postProtected("")
        } catch (error) {
            console.log({error});
        }
    }

    const updateOrderStatus = async event => {
        event.preventDefault()
        set_updating_status(true)
        set_sidebar_success("")
        set_sidebar_error("")

        const value = event.target[0].value

        const updateOrderStatusRequest = await putProtected(`orders/status/${selectedOrder._id}`, {new_status : value})

        set_updating_status(false)
        if (updateOrderStatusRequest && updateOrderStatusRequest.status === "OK") {
            set_sidebar_success("Successfully updated order status.")
            fetchOrders()

            let temp = {...selectedOrder}
            selectedOrder.status = value
            setSelectedOrder(temp)
        } else {
            set_sidebar_error(updateOrderStatusRequest.error.message)
        }

    }


    return (
        <div className={styles.orders}>
            {
                Object.entries(selectedOrder).length > 0 && <SideBar closeSideBar={() => closeSideBar()}>
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

                                <td className={styles.rightCell}>{getFormattedDate(selectedOrder.orderDate)}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Customer Name:</td>

                                <td className={styles.rightCell}>{`${selectedOrder.customerDetails.contact_details.first_name} ${selectedOrder.customerDetails.contact_details.last_name}`}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Phone:</td>

                                <td className={styles.rightCell}>{selectedOrder.customerDetails?.contact_details?.phoneNumber}</td>
                            </tr>

                            {/* <tr>
                                <td className={styles.leftCell}>Payment Method:</td>

                                <td className={styles.rightCell}>{selectedOrder.paymentMethod}</td>
                            </tr> */}
{/* 
                            <tr>
                                <td className={styles.leftCell}>Item Name:</td>

                                <td className={styles.rightCell}>{selectedOrder.itemName}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Quantity:</td>

                                <td className={styles.rightCell}>{selectedOrder.quantity}</td>
                            </tr> */}

                            <tr>
                                <td className={styles.leftCell}>Order Status:</td>

                                <td className={styles.rightCell}><span><label className={[styles.status, "m0", getStatusStyle(order_statuses[selectedOrder.status])].join(" ")}>{order_statuses[selectedOrder.status].slice(0,1).toUpperCase() + order_statuses[selectedOrder.status].slice(1)}</label></span></td>
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
                                                selectedOrder.products.map((item, index) => <tr key={index}>

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

                            {/* {
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
                            } */}

                            {/* <tr>
                                <td className={styles.leftCell}>Price:</td>

                                <td className={styles.rightCell}>{selectedOrder.price}</td>
                            </tr> */}
                        </tbody>
                    </table>

                    <hr />

                    <table>
                        <tbody>
                        <tr>
                                <td className={styles.leftCell}>Total:</td>

                                <td className={styles.total}>{formatter.format(selectedOrder.totalAmount)}</td>
                            </tr>
                        </tbody>
                    </table>

                    
                </div>

                <footer className={["displayFlex alignCenter", styles.sidebarFooter].join(" ")}>
                    <div>
                        {
                            sidebar_error && <ErrorBox errorMessage={sidebar_error} hideClose={true}  />
                        }

                        {
                            sidebar_success && <SuccessBox successMessage={sidebar_success} noClose={true} />
                        }
                        
                    </div>
                    <form disabled={updating_status} onSubmit={event => updateOrderStatus(event)}>
                    <select disabled={updating_status}>
                        <option value={0} disabled selected>Pending</option>
                        <option value={1} disabled={selectedOrder.status >= 1 || selectedOrder.status > 4}>Processing</option>
                        <option value={2} disabled={selectedOrder.status >= 2 || selectedOrder.status > 4}>Ready</option>
                        <option value={3} disabled={selectedOrder.status >= 3 || selectedOrder.status > 4} >Picked Up</option>
                        <option value={4} disabled={selectedOrder.status >= 4 || selectedOrder.status > 4}>Delivered</option>
                        <option value={5} disabled={selectedOrder.status > 4}>Completed</option>
                        <option value={6} disabled={selectedOrder.status > 4}>Canceled</option>
                        <option value={7} disabled={selectedOrder.status > 4}>Returned</option>
                    </select>
                        {/* <DropDown options={order_statuses} placeholder={order_statuses[selectedOrder.status].slice(0,1).toUpperCase() + order_statuses[selectedOrder.status].slice(1)} defaultValue={order_statuses[selectedOrder.status].slice(0,1).toUpperCase() + order_statuses[selectedOrder.status].slice(1)} onChange={(e) => handleStatusChange(e)} /> */}
                        <Button label={"Submit"} theme={"solid"} />
                    </form>
                    </footer>
            </SideBar>
            }

            <Head>
                <title>Products | Dawomed</title>
            </Head>


            
            <header className='displayFlex'>


                <div className={[styles.headerTabs, 'displayFlex'].join("  ")}>
                    <p className={activeTab === "all" ? styles.active : styles.inactive} onClick={() => setTab("all")}>All Orders</p>

                    <p className={activeTab === "pending" ? styles.active : styles.inactive} onClick={() => setTab("pending")}>Pending</p>

                    <p className={activeTab === "processing" ? styles.active : styles.inactive} onClick={() => setTab("processing")}>Processing</p>

                    <p className={activeTab === "canceled" ? styles.active : styles.inactive} onClick={() => setTab("canceled")}>Canceled</p>

                    <p className={activeTab === "picked up" ? styles.active : styles.inactive} onClick={() => setTab("picked up")}>Picked Up</p>

                    <p className={activeTab === "delivered" ? styles.active : styles.inactive} onClick={() => setTab("delivered")}>Delivered</p>

                    <p className={activeTab === "ready" ? styles.active : styles.inactive} onClick={() => setTab("ready")}>Ready</p>

                    <p className={activeTab === "completed" ? styles.active : styles.inactive} onClick={() => setTab("completed")}>Completed</p>

                    <p className={activeTab === "returned" ? styles.active : styles.inactive} onClick={() => setTab("returned")}>Returned</p>
                </div>
            </header>

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
                    <thead>
                    <tr className={styles.tableHeader}>
                            <td>REF</td>

                            <td>CUSTOMER</td>
                            <td>DATE ORDERED</td>
                            <td>DELIVERY METHOD</td>
                            <td>TOTAL</td>
                            <td>STATUS</td>
                            <td>DELIVERY DATE</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        

                        {
                            orders.map((order, index) => <OrderTableItem order={order} key={order._id} setSelectedOrder={() => setSelectedOrder(order)} />)
                        }
                    </tbody>
                </table>

                {
                    fetchingOrders && <div>
                    <TransparentLoader />
                </div>
                }
            </div>

        </div>
    )
}

Products.getLayout = function getLayout (page) {
    return <LoggedInLayout>
        {page}
    </LoggedInLayout>
}


export default Products

const OrderTableItem = ({ order, setSelectedOrder }) => {
    const getFormattedDate = orderDate => {

        const date = new Date(orderDate)

        return format(date, "PP")
    }

    


    return (
        <tr className={styles.orderTableItem}>
            <td className={styles.image}>
                <p>{order._id}</p>
            </td>


            <td>
                <p>{`${order?.customerDetails?.contact_details?.first_name} ${order?.customerDetails?.contact_details?.last_name}`}</p>
            </td>

            <td>
                <p>{getFormattedDate(order.orderDate)}</p>
            </td>

            <td>
                <p>{"Pick Up"}</p>
            </td>


            <td>
                <p>{formatter.format(order.totalAmount)}</p>
            </td>
            
            <td>
                <label className={[styles.status, getStatusStyle(order_statuses[order.status])].join(" ")}>{String(order_statuses[order.status])[0].toUpperCase() + String(order_statuses[order.status]).substr(1)}</label>   
            </td>

            <td>
                <p>{"-"}</p>
            </td>

            <td>
                <button onClick={() => setSelectedOrder()}>View Details</button>
            </td>

            
        </tr>
    )
}
