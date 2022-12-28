import React, { useEffect, useState } from 'react';
import NotificationsSideBar from './components/notificationsSideBar';
import TopNav from './components/top-nav';
import loggedInLayoutStyles from "./styles/styles.module.css";
import {useCookies} from "react-cookie"
import { useRouter } from 'next/router';
import { getProtected } from '../../../requests/getProtected';
import { postProtected } from '../../../requests/postProtected';

const LoggedInLayout = ({ children }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [checkedLoggedIn, setCheckedLoggedIn] = useState(false)
    const [cookies, setCookies] = useCookies(["user"])
    const [newActivityCount, setNewActivityCount] = useState({
        newNotificationsCount : 0,
        newOrdersCount : 0,
        newPickUpSlipsCount : 0
    })
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
        fetchCounts()
    }, [])

    useEffect(() => {
        resetCounts()
    }, [router])

    const resetCounts = async () => {
        try {
            console.log({router});
            const path = String(router.route).replace("/", "")

            console.log({path});
            if (path === "orders" || path === "pick-up-slip") {
                const resetCountsRequest = await postProtected("reset_counts", {countToReset : path})

                if (resetCountsRequest) {
                    fetchCounts()
                }
            }
            
        } catch (error) {
            console.log({error});
        }
    }

    const resetNotificationsCount = async () => {
        console.log("resetting notifications");
        try {
            const resetCountsRequest = await postProtected("reset_counts", {countToReset : "notifications"})

                if (resetCountsRequest) {
                    fetchCounts()
                }
        } catch (error) {
            console.log({error});
        }
    }

    const checkLoggedIn = () => {
        if (!cookies.Token){
            router.push("/login")
        } else {
            setCheckedLoggedIn(true)
        }
        
    }

    const fetchCounts = async () => {
        try {
            const fetchCountsRequest = await getProtected("get_counts")

            if (fetchCountsRequest.status && fetchCountsRequest.status === "OK") {
                let temp = {...newActivityCount}
                temp = fetchCountsRequest.data
                setNewActivityCount(temp)
            }

            console.log({fetchCountsRequest});
        } catch (error) {
            console.log({error});
        }
    }

    if (checkedLoggedIn) {
        return (
            <div className={loggedInLayoutStyles.loggedInLayout}>
                <TopNav  newActivityCount={newActivityCount} toggleShowNotifications={() => toggleShowNotifications()} />
                
                {
                    showNotifications && <NotificationsSideBar resetNotificationsCount={() => resetNotificationsCount()} toggleShowNotifications={() => toggleShowNotifications()} />
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