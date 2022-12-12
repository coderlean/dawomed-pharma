import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Ticker from 'react-ticker'
import Button from '../components/atoms/Button'
import DropDown from '../components/atoms/DropDown'
import LoggedInLayout from '../components/layouts/LoggedInLayout/loggedinLayout'
import styles from '../styles/Home.module.css'
import {useCookies} from "react-cookie"
import { useRouter } from 'next/router'
import { getProtected } from '../requests/getProtected'
import Modal from '../components/layouts/Modal'
import ButtonLoader from '../components/atoms/ButtonLoader'
import ErrorBox from '../components/atoms/ErrorBox'
import { postProtected } from '../requests/postProtected'
import SuccessBox from '../components/atoms/SuccessBox'
import { iconsSVGs } from '../assets/images/icons'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

export default function Home() {
  const [news, setNews] = useState("")
  const [cookies, setCookie] = useCookies(["user"])
  const router = useRouter()
  const [checkedLoggedIn, setCheckedLoggedIn] = useState(false)
  const [requestingPayout, setRequestingPayout] = useState(false)
  const [payoutErrorMessage, setPayoutErrorMessage] = useState("")
  const [payoutSuccess, setPayoutSuccess] = useState(false)
  const [payingOut, setPayingOut] = useState(false)
  const [saleStats, setSaleStats] = useState([0,0,0,0,0,0,0,0,0,0,0,0])
  const [notifications, setNotifications] = useState([])
  const [pharmacyData, setPharmacyData] = useState({
    balance : "",
    sales: "",
    returns : "",
    escrow : ""
  })

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {

    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
  }

  const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September" , "October", "November", "December"]

  const statsData = {
    labels,
    datasets : [
      {
        label: 'Sales',
        data: saleStats,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  }

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

  useEffect(() => {
    checkLoggedIn()
    setNews(<div>News: This is what the news is</div>)
    fetchPharmacyData()
  }, [])

  const checkLoggedIn = () => {
    if (!cookies.Token){
      router.push("/login")
    }
    setCheckedLoggedIn(true)
  }

  const fetchPharmacyData = async () => {
    try {
      const pharmacyData = await getProtected("pharmacies/data")

      console.log({pharmacyData});

      if (pharmacyData && pharmacyData.status === "OK") {
        let temp = {...pharmacyData}
        temp["balance"] = pharmacyData.data.balance
        temp["sales"] = pharmacyData.data.sales
        temp["returns"] = pharmacyData.data.returns
        temp["escrow"] = pharmacyData.data.escrow
        temp["bank_details"] = pharmacyData.data.bank_details
        setPharmacyData(temp)

        const salesData = Object.values(pharmacyData.data.salesStats)

        temp = [...saleStats]
        temp = salesData
        setSaleStats(temp)
      }
    } catch (error) {
      console.log({error});
    }
  }



  const validatePayoutData = event => {
    event.preventDefault()

    const payoutAmount = event.target[3].value

    if (!payoutAmount) {
      setPayoutErrorMessage("Please enter the amount you want to be paid out.")
    } else if (payoutAmount > pharmacyData.balance) {
      setPayoutErrorMessage("Your requested amout is greater than your current balance.")
    } else {
      setPayoutErrorMessage("")
      requestPayout(payoutAmount)
    }
  }

  const requestPayout = async payoutAmount => {
    try {
      setRequestingPayout(true)
      const requestPayout = await postProtected("pharmacies/requestPayout", {payoutAmount})

      if (requestPayout && requestPayout.status === "OK") {
        setPayoutSuccess(true)
        setPayingOut(false)
      } else {
        setPayoutErrorMessage(requestPayout?.error?.message)
      }

      setRequestingPayout(false)
    } catch (error) {
      console.log({error});
    }
  }

  const getActivityItem  = item => {
    switch (item.statusType){
      case "new order":
        return <div className={[styles.activityItem].join(" ")}>
          <div className="displayFlex jcSpaceBetween">
            <p><span>{item.customerName}</span> just ordered <span>{item.productName}</span> [Order ID: <span>{item.orderID}</span>]</p>

            <p className={styles.more}>View Details</p>
          </div>

          <label>{item.date}</label>
        </div>

      case "return":
        return <div className={[styles.activityItem].join(" ")}>
            <div className="displayFlex jcSpaceBetween" >
              <p><span>{item.customerName}</span> just requested to return <span>{item.productName}</span> [Order ID: <span>{item.orderID}</span>]</p>

              <p className={styles.more}>View Details</p>
            </div>

            <label>{item.date}</label>
        </div>
      case "delivery":
        return <div className={[styles.activityItem].join(" ")}>
            <div className="displayFlex jcSpaceBetween">
              <p><span>{item.deliveryCompany}</span> successfully delivered <span>{item.productName}</span> to <span>{item.customerName}</span></p>

              <p className={styles.more}>View Details</p>
            </div>

            <label>{item.date}</label>
        </div>
      case "update":
        return <div className={[styles.activityItem].join(" ")}>
            <div className="displayFlex jcSpaceBetween">
              <p><span>{item.title}</span></p>

              <p className={styles.more}>View Details</p>
            </div>

            <label>{item.date}</label>
        </div>
      default:
        return <React.Fragment></React.Fragment>
    }
  }

  if (!checkedLoggedIn) {
    return (<div>Not logged in</div>)
  }
  
  if (checkedLoggedIn){ return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard | Dawomed</title>

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
      </Head>

      {payingOut && <Modal>
          <div className={styles.requestModalContainer}>
          <div className={styles.requestPayoutModal}>
            <header>
              <h2>Request Payout</h2>
            </header>

            <hr />
            
            <form onSubmit={event => validatePayoutData(event)}>
              {
                payoutErrorMessage && <span>
                <ErrorBox errorMessage={payoutErrorMessage} closeErrorBox={() => setPayoutErrorMessage("")} />
              </span>
              }

              <div>
                <div>
                  <label>Account Name</label>

                  <div className={styles.disabledField}>
                    <input disabled placeholder='Account Name' value={pharmacyData?.bank_details?.account_name} />
                    <p></p>
                  </div>
                </div>

                <div>
                  <label>Account Number</label>
                  
                  <div className={styles.disabledField}>
                    <input disabled placeholder='Account Number' value={pharmacyData?.bank_details?.account_number} />
                    <p></p>
                  </div>
                </div>
              </div>

              <div>
                <div >
                  <label>Available Balance</label>
                  
                  <div className={styles.disabledField}>
                    <input disabled placeholder='Available Balance' value={Intl.NumberFormat("En-US").format(pharmacyData.balance)} />
                    <p>₦</p>
                  </div>
                </div>

                <div >
                  <label>Payout Amount</label>
                  
                  <div>
                    <input disabled={requestingPayout} placeholder='Payout Amount' />
                    <p>₦</p>
                  </div>
                </div>
              </div>

              <hr />

              <div>
                <button disabled={requestingPayout}>
                  {
                    !requestingPayout && <p>Request Payout</p>
                  }
                  {
                    requestingPayout && <ButtonLoader />
                  }
                </button>
              </div>
            </form>
          </div>

          <span onClick={() => setPayingOut(false)}>
            {
              iconsSVGs.closeIconWhite
            }
          </span>
          </div>
        
      </Modal>
      }

      {
        payoutSuccess && <Modal>
        <div className={styles.payoutSuccess}>
          <header>
            {
              iconsSVGs.payoutSuccess
            }
          </header>

          <div>
            <p>PAYOUT REQUEST SUCCESSFUL</p>

            <p>We have received your payout request and would process it as soon as possible and pay out the requested amount to your saved bank account.</p>

            <hr />

            
          </div>

          <button onClick={() => setPayoutSuccess(false)}>DONE</button>
        </div>
      </Modal>
      }

      
      {
        news !== "" && <div className={styles.ticker}>
        <Ticker>
          {
            ({ index }) => <>
            {news}
            </>
          }
        </Ticker>
      </div>
      }

      {/* <div className={styles.verificationAlert}>
        <div className='displayFlex alignCenter'>
        <svg className='mr10' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_1551_6179)">
          <path d="M10.29 3.8602L1.82002 18.0002C1.64539 18.3026 1.55299 18.6455 1.55201 18.9947C1.55103 19.3439 1.64151 19.6873 1.81445 19.9907C1.98738 20.2941 2.23675 20.547 2.53773 20.7241C2.83871 20.9012 3.18082 20.9964 3.53002 21.0002H20.47C20.8192 20.9964 21.1613 20.9012 21.4623 20.7241C21.7633 20.547 22.0127 20.2941 22.1856 19.9907C22.3585 19.6873 22.449 19.3439 22.448 18.9947C22.4471 18.6455 22.3547 18.3026 22.18 18.0002L13.71 3.8602C13.5318 3.56631 13.2807 3.32332 12.9812 3.15469C12.6817 2.98605 12.3438 2.89746 12 2.89746C11.6563 2.89746 11.3184 2.98605 11.0188 3.15469C10.7193 3.32332 10.4683 3.56631 10.29 3.8602V3.8602Z" stroke="#AB570A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 17H12.01" stroke="#AB570A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 9V13" stroke="#AB570A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
          <clipPath id="clip0_1551_6179">
          <rect width="24" height="24" fill="white"/>
          </clipPath>
          </defs>
        </svg>

        <p>Your pharmacy seller account is yet to be verified <span>Click here to resend verification code</span></p>
        </div>

        <button>
          Learn more
        </button>
      </div> */}


      <header className='displayFlex alignCenter widthFull jcSpaceBetween'>
        <div>
          <h2>Dashboard</h2>
          <label>Quick overview of the sales activities</label>
        </div>

        <div>
          <form className='displayFlex alignCenter'>
          <DropDown defaultValue={"This Week"} options={["Today", "This Week", "This Month", "This Year"]} />
          <Button label={"Download Report"} theme={"solid"} buttonIntent="download" />
          </form>
        </div>
      </header>

      <div className={[styles.dashboardBoxes, "mt40"].join(" ")}>
        <div className={[styles.available, styles.box].join(" ")}>

          <h3>Available Funds</h3>

          <div className='displayFlex jcSpaceBetween'>
            <p>{pharmacyData.balance} <span>NGN</span></p>

            {
              pharmacyData.balance > 0 && <Button label={"Request Pay Out"} theme={"solid"} onButtonClick={() => setPayingOut(true)} />
            }
          </div>

        </div>

        <DashboardItem
        icon={
          <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M15.6504 1.68217H6.77974C4.0064 1.6715 1.73307 3.88217 1.66774 6.65417V20.9382C1.6064 23.7555 3.83974 26.0902 6.65707 26.1528C6.6984 26.1528 6.7384 26.1542 6.77974 26.1528H17.4317C20.2237 26.0395 22.4237 23.7328 22.4037 20.9382V8.71683L15.6504 1.68217Z" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.3003 1.6665V5.54517C15.3003 7.4385 16.831 8.97317 18.7243 8.9785H22.3976" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.0508 18.4777H7.85083" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.3243 13.4743H7.84961" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
        data={pharmacyData.escrow + " NGN"}
        label="In Escrow"
        />

        <DashboardItem
        icon={
          <svg width="25" height="27" viewBox="0 0 25 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.36511 6.33366C9.55244 4.6588 15.6299 4.27463 18.3334 4.33366C21.0369 4.39269 22.1776 5.35539 23.0001 7.00033C24.3334 9.66699 24.0521 16.3178 21.6667 18.4498C19.2827 20.5818 9.44028 20.7845 6.16028 18.4498C2.69494 15.9818 4.50541 9.25633 4.39208 4.65766C4.46008 2.08433 1.66675 1.66699 1.66675 1.66699" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.3335 11.0002H18.0308" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M6.68516 23.8369C7.08516 23.8369 7.4105 24.1622 7.4105 24.5622C7.4105 24.9636 7.08516 25.2889 6.68516 25.2889C6.28383 25.2889 5.9585 24.9636 5.9585 24.5622C5.9585 24.1622 6.28383 23.8369 6.68516 23.8369Z" fill="#666666" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M20.4607 23.8369C20.862 23.8369 21.1874 24.1622 21.1874 24.5622C21.1874 24.9636 20.862 25.2889 20.4607 25.2889C20.0607 25.2889 19.7354 24.9636 19.7354 24.5622C19.7354 24.1622 20.0607 23.8369 20.4607 23.8369Z" fill="#666666" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
        data={pharmacyData.sales}
        label="Total Sales"
        />

        <DashboardItem
        icon={
          <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.30558 1.13525V17.9593" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M0.866699 6.59997C0.866699 6.59997 3.7587 1.1333 6.30403 1.1333C8.84803 1.1333 11.7414 6.59997 11.7414 6.59997" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.5412 20.9031V4.0791" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24.9801 15.438C24.9801 15.438 22.0868 20.9047 19.5428 20.9047C16.9988 20.9047 14.1055 15.438 14.1055 15.438" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
        data={pharmacyData.returns}
        label="Return Requests"
        />
      </div>


      <div className={[styles.statsAndActivities, "displayFlex jcSpaceBetween"].join(" ")}>
        <div className={styles.stats}>
          <header>
            <p>Sales Statistics</p>
          </header>

          <main>
              <Line options={options} data={statsData} />
          </main>
        </div>

        <div className={styles.activities}>
          <header>
            <p>Recent Activities</p>
          </header>

          <main>
            {
              sampleData.map((item, index) => getActivityItem(item))
            }
          </main>
        </div>
      </div>
    </div>
  )}
}

const DashboardItem = ({icon, label, data}) => {
  return (
    <div className={[styles.dashboardItem, styles.box].join(" ")}>
      <div>
        <h4>{label}</h4>

      </div>

      <div>
        <div className='displayFlex alignCenter'>
          {icon}
          <p>{data}</p>
        </div>
      </div>
    </div>
  )
}

Home.getLayout = function getLayout (page) {
  return <LoggedInLayout>
    {page}
  </LoggedInLayout>
}
