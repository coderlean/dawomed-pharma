import React from 'react';
import { iconsSVGs } from '../../../../assets/images/icons';
import styles from '../styles/styles.module.css';

const NotificationsSideBar = ({toggleShowNotifications}) => {
    const sampleData = [
        {
          customerName: "John Doe",
          productName: "Product 1",
          date: "2020-01-01",
          productID: "1",
          orderID: "1",
          statusType: "new order"
        }, 
        {
          customerName: "Jane Doe",
          productName: "Product 2",
          date: "2020-01-01",
          productID: "2",
          orderID: "2",
          statusType: "return"
        },
        {
          customerName: "Gbenga Adeolu",
          productName: "Product 3",
          date: "2020-01-01",
          productID: "3",
          orderID: "3",
          statusType: "delivery",
          deliveryCompany: "DHL"
        },
        {
          customerName: "Anu Fatoki",
          productName: "Product 4",
          date: "2020-01-01",
          productID: "4",
          orderID: "4",
          statusType: "new order"
        },
        {
          customerName: "Anu Fatoki",
          productName: "Product 4",
          date: "2020-01-01",
          productID: "4",
          orderID: "4",
          statusType: "update",
          title: "We would like to announce a new version of Dawomed for Pharmacies",
          body: "We would like to announce a new version of Dawomed for Pharmacies. This is a very important update that will help you to get the most out of Dawomed. We are very excited to announce this update and we hope you will enjoy Dawomed as much as we enjoyed making it."
        }
      ]

    const getNotificationData = item => {
        switch (item.statusType) {
            case "new order":
                return {
                    icon: iconsSVGs.shoppingCart,
                    title: "New Order!",
                    text: `New order for item ${item.productName} on ${item.date}`
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
                    <label>5</label>
                    </div>
                </header>

                <div className='pb20'>
                    {
                        sampleData.map((item, index) => <NotificationItem data={getNotificationData(item)} />)
                    }
                </div>

            </div>
        </div>
    )
}

const NotificationItem = ({data}) => {
    if (Object.entries(data).length === 0) {
        return <></>
    } else {
        return <div className={[styles.notificationBarItem, "displayFlex alignCenter"].join(" ")}>
        <div className={styles.icon}>
            {data.icon}
        </div>
        <div>
            <h4>{data.title}</h4>
            <p>{data.text}</p>
        </div>

        <label>View Details</label>
    </div>
    }

    
}

export default NotificationsSideBar