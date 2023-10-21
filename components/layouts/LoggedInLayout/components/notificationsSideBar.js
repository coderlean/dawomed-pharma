import React, { useEffect, useState } from 'react';
import { iconsSVGs } from '../../../../assets/images/icons';
import { getProtected } from '../../../../requests/getProtected';
import styles from '../styles/styles.module.css';
import {format} from "date-fns"
import { useRouter } from 'next/router';

const NotificationsSideBar = ({toggleShowNotifications, resetNotificationsCount}) => {
    const [notifications, setNotifications] = useState([])
    useEffect(() => {
        fetchPharmacyNotifications()
    }, [])

    const fetchPharmacyNotifications = async () => {
        try {
          const notificationsList = await getProtected(`pharmacies/notifications`)

          console.log("resetting notifications count");
          resetNotificationsCount()
    
          let temp = [...notifications]
          temp = notificationsList.data
          setNotifications(temp)
        } catch (error) {
          console.log({error});
        }
      }

    

    const getNotificationData = item => {
        switch (item.activity) {
            case "New Order":
                return {
                    icon: iconsSVGs.shoppingCart,
                    title: "New Order!",
                    text: `You have received a new order. Move the order to confirmed before it times out. `,
                    date: item.date,
                    id: item.orderID._id,
                    type: "New Order"
                }
            case "return":
                return {
                    icon: iconsSVGs.alertTriangle,
                    title: "Return!",
                    text: `Return for item ${item.productName} on ${item.date}`
                }
            case "delivery":
                return {
                    icon: iconsSVGs.deliveryBox,
                    title: "Delivery!",
                    text: `Delivery for item ${item.productName} on ${item.date}`
                }
                case "out of stock":
                    return {
                        icon: iconsSVGs.alertTriangle,
                        title: "Item out of stock!",
                        text: `Item ${item.productName} is out of stock`
                    }
                default : {
                    return {}
                }}
    }
    
    return (
        <div className={styles.notificationsSideBar}>
            <svg onClick={() => toggleShowNotifications()} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.22517 0.811448C1.83465 0.420924 1.20148 0.420924 0.81096 0.811448C0.420435 1.20197 0.420435 1.83514 0.81096 2.22566L6.58569 8.0004L0.811019 13.7751C0.420495 14.1656 0.420495 14.7988 0.811019 15.1893C1.20154 15.5798 1.83471 15.5798 2.22523 15.1893L7.99991 9.41461L13.7746 15.1893C14.1651 15.5798 14.7983 15.5798 15.1888 15.1893C15.5793 14.7988 15.5793 14.1656 15.1888 13.7751L9.41412 8.0004L15.1889 2.22566C15.5794 1.83514 15.5794 1.20197 15.1889 0.811448C14.7983 0.420924 14.1652 0.420924 13.7746 0.811448L7.99991 6.58618L2.22517 0.811448Z" fill="white"/>
            </svg>

            <div>
                <header>
                    <div className='displayFlex alignCenter p20'>
                    <h3>Notifications</h3>
                    <label>{notifications.length}</label>
                    </div>
                </header>

                <div className='pb20'>
                    {
                        notifications.map((item, index) => <NotificationItem key={index} data={getNotificationData(item)} />)
                    }
                </div>

            </div>
        </div>
    )
}

const NotificationItem = ({data}) => {

    const [date, setDate] = useState("")
    const router = useRouter()

    useEffect(() => {
        setNotificationDate()
    }, [])

    const setNotificationDate = () => {
        const notificationDate = new Date(data.date)
        setDate(format(notificationDate, "PPP"))
    }

    const handleClick = () => {
        switch (data.type) {
            case "New Order": 
                router.push(`/orders?id=${data.id}`)
        }
    }
    
    
    if (Object.entries(data).length === 0) {
        return <></>
    } else {
        return <div onClick={() => handleClick()} className={[styles.notificationBarItem, "displayFlex alignCenter"].join(" ")}>
        <div className={styles.icon}>
            {data.icon}
        </div>
        <div>
            <h4>{data.title}</h4>
            <p>{data.text}</p>
            <p className={styles.notificationDate}>{date}</p>
        </div>

        <label>View Details</label>
    </div>
    }

    
}

export default NotificationsSideBar