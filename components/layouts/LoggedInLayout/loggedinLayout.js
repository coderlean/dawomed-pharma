import React, { useEffect, useState } from 'react';
import NotificationsSideBar from './components/notificationsSideBar';
import TopNav from './components/top-nav';
import loggedInLayoutStyles from "./styles/styles.module.css";
import {useCookies} from "react-cookie"
import { useRouter } from 'next/router';

const LoggedInLayout = ({ children }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [checkedLoggedIn, setCheckedLoggedIn] = useState(false)
    const [cookies, setCookies] = useCookies(["user"])
    const router = useRouter()

    const toggleShowNotifications = () => {
        if (showNotifications) {
            setShowNotifications(false);
        } else {
            setShowNotifications(true);
        }
    }

    useEffect(() => {
        	setShowNotifications(false)
    }, [router])

    useEffect(() => {
        checkLoggedIn()
        
    })

    const checkLoggedIn = () => {
        if (!cookies.Token){
            router.push("/login")
        } else {
            setCheckedLoggedIn(true)
        }
        
    }

    if (checkedLoggedIn) {
        return (
            <div className={loggedInLayoutStyles.loggedInLayout}>
                <TopNav toggleShowNotifications={() => toggleShowNotifications()} />
                
                {
                    showNotifications && <NotificationsSideBar toggleShowNotifications={() => toggleShowNotifications()} />
                }
                {children}
            </div>
        )
    } else {
        return <div>

        </div>
    }
}

export default LoggedInLayout;