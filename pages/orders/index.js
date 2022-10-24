import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { iconsSVGs } from '../../assets/images/icons';
import LoggedInLayout from '../../components/layouts/LoggedInLayout/loggedinLayout';
import styles from "./styles/styles.module.css";
import SideBar from '../../components/layouts/SideBar';
import DropDown from '../../components/atoms/DropDown';
import Button from '../../components/atoms/Button';
import { getProtected } from '../../requests/getProtected';

const getStatusStyle = (status) => {
    switch (status){
        case "pending":
            return styles.pending
        case "processing":
            return styles.processing
        case "declined":
            return styles.declined
        case "returned":
            return styles.returned
        case "ready for delivery":
            return styles.readyForDelivery
        case "ready for pickup":
            return styles.readyForPickup
        default:
            return styles.completed
    }
}


const Products = () => {
    const [activeTab, setActiveTab] = useState("all")
    const [showNewProductModal, setShowNewProductModal] = useState(false)
    const [orders, setOrders] = useState([])
    const [allOrders, setAllOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState({})

    useEffect(() => {
        setOrders(sampleOrders)
        setAllOrders(sampleOrders)
        fetchOrders()
    }, [])

    const setCurrentTab = (currentTab) => {
        var tempOrders = allOrders
        tempOrders = tempOrders.filter(order => order.status.toLowerCase() === currentTab)
        setOrders(tempOrders)
    }

    const fetchOrders = async () => {
        const pharmacy = JSON.parse(localStorage.getItem("user"))
        console.log({pharmacy});
        try {
            const ordersList = await getProtected(`orders/pharmacy/all/${pharmacy._id}`)
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

            <Head>
                <title>Products | Dawomed</title>
            </Head>


            
            <header className='displayFlex'>


                <div className={[styles.headerTabs, 'displayFlex'].join("  ")}>
                    <p className={activeTab === "all" ? styles.active : styles.inactive} onClick={() => setTab("all")}>All Orders</p>

                    <p className={activeTab === "pending" ? styles.active : styles.inactive} onClick={() => setTab("pending")}>Pending</p>

                    <p className={activeTab === "declined" ? styles.active : styles.inactive} onClick={() => setTab("declined")}>Declined</p>

                    <p className={activeTab === "ready" ? styles.active : styles.inactive} onClick={() => setTab("ready")}>Ready for Pick Up</p>

                    <p className={activeTab === "completed" ? styles.active : styles.inactive} onClick={() => setTab("completed")}>Completed</p>

                    <p className={activeTab === "returns" ? styles.active : styles.inactive} onClick={() => setTab("returns")}>Returns</p>
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
                    <tbody>
                        <tr className={styles.tableHeader}>
                            <td>REF</td>
                            <td>ITEM NAME</td>
                            <td>CUSTOMER</td>
                            <td>DATE ORDERED</td>
                            <td>DELIVERY METHOD</td>
                            <td>PRICE</td>
                            <td>QTY</td>
                            <td>TOTAL</td>
                            <td>STATUS</td>
                            <td>DELIVERY DATE</td>
                            <td>Action</td>
                        </tr>

                        {
                            orders.map((order, index) => <OrderTableItem order={order} key={order._id} setSelectedOrder={() => setSelectedOrder(order)} />)
                        }
                    </tbody>
                </table>
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


    return (
        <tr className={styles.orderTableItem}>
            <td className={styles.image}>
                <p>{order._id}</p>
            </td>

            <td>
                <p>{order.itemName}</p>
            </td>

            <td>
                <p>{order.customer.name}</p>
            </td>

            <td>
                <p>{order.dateOrdered}</p>
            </td>

            <td>
                <p>{order.deliveryMethod}</p>
            </td>

            <td>
                <p>{order.price}</p>
            </td>

            <td>
                <p>{order.quantity}</p>
            </td>

            <td>
                <p>{order.price * order.quantity}</p>
            </td>
            
            <td>
                <label className={[styles.status, getStatusStyle(order.status)].join(" ")}>{order.status[0].toUpperCase() + order.status.substr(1)}</label>   
            </td>

            <td>
                <p>{order.deliveryDate}</p>
            </td>

            <td>
                <button onClick={() => setSelectedOrder()}>View Details</button>
            </td>

            
        </tr>
    )
}

const sampleOrders = [
    {
        itemName: "Azithromycin",
        quantity: 10,
        discountPercentage: 10,
        category: "Antibiotics",
        brand: "Emzor",
        price: 2500,
        prescription: false,
        rating: 3,
        _id: 1,
        customer: {
            name: "John Doe",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateOrdered : Date.now(),
        deliveryMethod : "Gokada",
        status: "pending",
        deliveryDate: Date.now(),
        paymentMethod: "Debit Card",
        paymentMerchant: "Visa",
        deliveryFee: 1500
    },

    {
        itemName: "Lincomycin",
        quantity: 1,
        discountPercentage: 10,
        category: "Antibiotics",
        brand: "Emzor",
        price: 1500,
        prescription: false,
        rating: 3,
        _id: 2,
        customer: {
            name: "Chioma Jesus",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateOrdered : Date.now(),
        deliveryMethod : "MaxNG",
        status: "pending",
        deliveryDate: Date.now(),
        paymentMethod: "Debit Card",
        paymentMerchant: "Visa",
        deliveryFee: 1500
    },

    {
        itemName: "Panadol",
        quantity: 2,
        discountPercentage: 10,
        category: "Pain killer",
        brand: "Emzor",
        price: 200,
        prescription: false,
        rating: 3,
        _id: 3,
        customer: {
            name: "Abdulkadir Ahmed",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateOrdered : Date.now(),
        deliveryMethod : "Pick Up",
        status: "completed",
        deliveryDate: Date.now(),
        paymentMethod: "Debit Card",
        paymentMerchant: "Visa",
        deliveryFee: 1500
    },

    {
        itemName: "Ventolin",
        quantity: 1,
        discountPercentage: 10,
        category: "Inhaler",
        brand: "Emzor",
        price: 2800,
        prescription: false,
        rating: 3,
        _id: 4,
        customer: {
            name: "Bunmi Adeosun",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateOrdered : Date.now(),
        deliveryMethod : "Gokada",
        status: "returned",
        deliveryDate: Date.now(),
        paymentMethod: "Debit Card",
        paymentMerchant: "Visa",
        deliveryFee: 1500
    },

    {
        itemName: "Voltfast 100mg",
        quantity: 2,
        discountPercentage: 10,
        category: "Pain Killer",
        brand: "Emzor",
        price: 800,
        prescription: false,
        rating: 3,
        _id: 5,
        customer: {
            name: "Tara Holmes",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateOrdered : Date.now(),
        deliveryMethod : "Pick Up",
        status: "declined",
        deliveryDate: Date.now(),
        paymentMethod: "Debit Card",
        paymentMerchant: "Visa",
        deliveryFee: 1500
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