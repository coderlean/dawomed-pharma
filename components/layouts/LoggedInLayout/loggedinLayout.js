import React, { useState } from 'react';
import NotificationsSideBar from './components/notificationsSideBar';
import TopNav from './components/top-nav';
import loggedInLayoutStyles from "./styles/styles.module.css";

const LoggedInLayout = ({ children }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleShowNotifications = () => {
        if (showNotifications) {
            setShowNotifications(false);
        } else {
            setShowNotifications(true);
        }
    }

    return (
        <div className={loggedInLayoutStyles.loggedInLayout}>
            <TopNav toggleShowNotifications={() => toggleShowNotifications()} />
            
            {
                showNotifications && <NotificationsSideBar toggleShowNotifications={() => toggleShowNotifications()} />
            }
            {children}
        </div>
    )
}

export default LoggedInLayout;