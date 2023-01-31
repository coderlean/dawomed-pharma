import Link from 'next/link';
import React from 'react';
import loggedInLayoutStyles from '../styles/styles.module.css';
import profileIcon from "../../../../assets/images/profile.png"
import { useRouter } from 'next/router';
import {useCookies} from "react-cookie"
import Image from 'next/image';
import { useClickedOutside } from '../../../../helpers/hooks';

const TopNav = ({toggleShowNotifications, newActivityCount, resetNotificationsCount}) => {
    var location = useRouter().pathname;
    location = location.split("/")[1];
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["user"])
    const router = useRouter()
    const user = JSON.parse(localStorage.getItem("user"))
    const userMenu = useClickedOutside(() => setShowUserMenu(false))

    const toggleUserMenu = () => {
        if (showUserMenu){
            setShowUserMenu(false)
        } else {
            setShowUserMenu(true)
        }
    }

    console.log({user});

    const signUserOut = () => {
        removeCookie(['Token'],{path:'/'})
        router.push("/login")
    }

    return <nav className={loggedInLayoutStyles.topNav}>
        {
            showUserMenu && <div className={[loggedInLayoutStyles.userMenu]}>
            <h6>{user.pharmacyName}</h6>

            <div>
                <Link href='/account'>Account</Link>
                <hr/>
                <p onClick={() => signUserOut()}>Sign Out</p>
            </div>
        </div>
        }


        <div className={[loggedInLayoutStyles.logoDiv, "mr20"].join(" ")}>
            <div className={[loggedInLayoutStyles.logo, ' displayFlex pl30 mr20 cursorPointer'].join(" ")}>
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 51 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <mask id="path-1-inside-1_609_14022" fill="white">
                        <path d="M50.5 25C50.5 38.8071 39.3071 50 25.5 50C11.6929 50 0.5 38.8071 0.5 25C0.5 11.1929 11.6929 0 25.5 0C39.3071 0 50.5 11.1929 50.5 25ZM10.5 25C10.5 33.2843 17.2157 40 25.5 40C33.7843 40 40.5 33.2843 40.5 25C40.5 16.7157 33.7843 10 25.5 10C17.2157 10 10.5 16.7157 10.5 25Z" />
                    </mask>
                    <path
                        d="M50.5 25C50.5 38.8071 39.3071 50 25.5 50C11.6929 50 0.5 38.8071 0.5 25C0.5 11.1929 11.6929 0 25.5 0C39.3071 0 50.5 11.1929 50.5 25ZM10.5 25C10.5 33.2843 17.2157 40 25.5 40C33.7843 40 40.5 33.2843 40.5 25C40.5 16.7157 33.7843 10 25.5 10C17.2157 10 10.5 16.7157 10.5 25Z"
                        stroke="#98BF0B"
                        strokeWidth="40"
                        mask="url(#path-1-inside-1_609_14022)"
                    />
                    <mask id="path-2-inside-2_609_14022" fill="white">
                        <path d="M50.5 25C50.5 20.3894 49.225 15.8687 46.816 11.9375C44.407 8.00639 40.9578 4.81799 36.8498 2.72484C32.7417 0.631687 28.1349 -0.284673 23.5385 0.0770666C18.9422 0.438807 14.5354 2.06456 10.8054 4.77457C7.07535 7.48459 4.1674 11.1733 2.40301 15.4329C0.638628 19.6925 0.0865413 24.3571 0.807791 28.9109C1.52904 33.4647 3.49553 37.7303 6.48985 41.2362C9.48417 44.7421 13.3897 47.3517 17.7746 48.7764L20.8647 39.2658C18.2338 38.411 15.8905 36.8453 14.0939 34.7417C12.2973 32.6382 11.1174 30.0788 10.6847 27.3465C10.2519 24.6142 10.5832 21.8155 11.6418 19.2597C12.7004 16.704 14.4452 14.4908 16.6832 12.8647C18.9212 11.2387 21.5653 10.2633 24.3231 10.0462C27.0809 9.8292 29.845 10.379 32.3099 11.6349C34.7747 12.8908 36.8442 14.8038 38.2896 17.1625C39.735 19.5212 40.5 22.2337 40.5 25H50.5Z" />
                    </mask>
                    <path
                        d="M50.5 25C50.5 20.3894 49.225 15.8687 46.816 11.9375C44.407 8.00639 40.9578 4.81799 36.8498 2.72484C32.7417 0.631687 28.1349 -0.284673 23.5385 0.0770666C18.9422 0.438807 14.5354 2.06456 10.8054 4.77457C7.07535 7.48459 4.1674 11.1733 2.40301 15.4329C0.638628 19.6925 0.0865413 24.3571 0.807791 28.9109C1.52904 33.4647 3.49553 37.7303 6.48985 41.2362C9.48417 44.7421 13.3897 47.3517 17.7746 48.7764L20.8647 39.2658C18.2338 38.411 15.8905 36.8453 14.0939 34.7417C12.2973 32.6382 11.1174 30.0788 10.6847 27.3465C10.2519 24.6142 10.5832 21.8155 11.6418 19.2597C12.7004 16.704 14.4452 14.4908 16.6832 12.8647C18.9212 11.2387 21.5653 10.2633 24.3231 10.0462C27.0809 9.8292 29.845 10.379 32.3099 11.6349C34.7747 12.8908 36.8442 14.8038 38.2896 17.1625C39.735 19.5212 40.5 22.2337 40.5 25H50.5Z"
                        stroke="url(#paint0_linear_609_14022)"
                        strokeWidth="40"
                        mask="url(#path-2-inside-2_609_14022)"
                    />
                    <defs>
                        <linearGradient
                        id="paint0_linear_609_14022"
                        x1="25.5"
                        y1="0"
                        x2="25.5"
                        y2="50"
                        gradientUnits="userSpaceOnUse"
                        >
                        <stop stopColor="#1D1272" />
                        <stop offset="1" stopColor="#6C5CE6" />
                        </linearGradient>
                    </defs>
                </svg>
                <div>
                    <h4>Dawomed</h4>
                    <p>Pharmacy Center</p>
                </div>
            </div>

            <div className='displayFlex, alignCenter'>
                <Link href={"/"}><label className={location === "" ? [loggedInLayoutStyles.activeNavItem, loggedInLayoutStyles.mr50].join(" ") : [loggedInLayoutStyles.inactiveNavItem, loggedInLayoutStyles.mr50].join(" ")}>Dashboard</label></Link>
                <Link href={"/products"}><span><label className={location === "products" ? [loggedInLayoutStyles.activeNavItem, loggedInLayoutStyles.mr50].join(" ") : [loggedInLayoutStyles.inactiveNavItem, loggedInLayoutStyles.mr50].join(" ")}>Products</label></span></Link>
                <Link href={"/orders"}>
                    <span>
                    <label className={location === "orders" ? loggedInLayoutStyles.activeNavItem : loggedInLayoutStyles.inactiveNavItem}>Orders</label>
                    <div className={loggedInLayoutStyles.countContainer}>
                        {
                            newActivityCount.newOrdersCount > 0 && <label>{newActivityCount.newOrdersCount}</label>
                        }
                    </div>
                    </span>
                </Link>
                <Link href={"/pick-up-slip"}>
                    <span>
                    <label className={location === "pick-up-slip" ? loggedInLayoutStyles.activeNavItem : loggedInLayoutStyles.inactiveNavItem}>Pick Up Slip</label>
                    <div className={loggedInLayoutStyles.countContainer}>
                        {
                            newActivityCount.newPickUpSlipsCount > 0 && <label>{newActivityCount.newPickUpSlipsCount}</label>
                        }
                    </div>
                    </span>
                </Link>
                <Link href={"/payment"}><label className={location === "payment" ? [loggedInLayoutStyles.activeNavItem, loggedInLayoutStyles.mr50].join(" ") : [loggedInLayoutStyles.inactiveNavItem, loggedInLayoutStyles.mr50].join(" ")}>Payment</label></Link>
                <Link href={"/report"}><label className={location === "report" ? loggedInLayoutStyles.activeNavItem : loggedInLayoutStyles.inactiveNavItem}>Report</label></Link>
            </div>
        </div>

        <div className='displayFlex alignCenter p10 pr30'>
            {/* <div className={[loggedInLayoutStyles.searchDiv, 'displayFlex alignCenter'].join(" ")}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.9304 12.9893C9.5765 14.8221 6.171 14.6565 4.00712 12.4926C1.66397 10.1495 1.66397 6.3505 4.00712 4.00736C6.35026 1.66421 10.1493 1.66421 12.4924 4.00736C14.6563 6.17125 14.8218 9.57674 12.989 11.9306C13.0005 11.9408 13.0117 11.9513 13.0227 11.9623L16.2047 15.1443C16.4976 15.4372 16.4976 15.9121 16.2047 16.205C15.9118 16.4978 15.4369 16.4978 15.1441 16.205L11.9621 13.023C11.9511 13.012 11.9405 13.0008 11.9304 12.9893ZM5.06778 11.432C6.82514 13.1893 9.67438 13.1893 11.4317 11.432C13.1891 9.67462 13.1891 6.82538 11.4317 5.06802C9.67438 3.31066 6.82514 3.31066 5.06778 5.06802C3.31042 6.82538 3.31042 9.67462 5.06778 11.432Z" fill="white" fillOpacity="0.6"/>
                </svg>
                <input placeholder='Search' />
            </div> */}

            <svg onClick={() => toggleShowNotifications()}  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='cursorPointer'>
                <path fillRule="evenodd" clipRule="evenodd" d="M14 3V3.28988C16.8915 4.15043 19 6.82898 19 10V17H20V19H4V17H5V10C5 6.82898 7.10851 4.15043 10 3.28988V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3ZM7 17H17V10C17 7.23858 14.7614 5 12 5C9.23858 5 7 7.23858 7 10V17ZM14 21V20H10V21C10 22.1046 10.8954 23 12 23C13.1046 23 14 22.1046 14 21Z" fill="white" fillOpacity="0.6"/>
            </svg>


            <div className='displayFlex alignCenter cursorPointer' onClick={() => toggleUserMenu()} ref={userMenu}>
                <div className={loggedInLayoutStyles.notification}>
                <img />
                {
                    newActivityCount.newNotificationsCount > 0 && <label>{newActivityCount.newNotificationsCount}</label>
                }
                </div>

                <Image src={user.logo ? user.logo : profileIcon} alt="profile" className={loggedInLayoutStyles.profile} width="30" height={"30"} />
                <p className='font14 mr10 ml10'>{user.pharmacyName}</p>
                
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.75744 0.817871L0.696777 1.87853L6.00006 7.18185L11.3034 1.87855L10.2427 0.817893L6.00008 5.06052L1.75744 0.817871Z" fill="white"/>
                </svg>
            </div>
        </div>
    </nav>
}

export default TopNav