import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { iconsSVGs } from '../../assets/images/icons';
import LoggedInLayout from '../../components/layouts/LoggedInLayout/loggedinLayout';
import styles from "./styles/styles.module.css";
import SideBar from '../../components/layouts/SideBar';
import DropDown from '../../components/atoms/DropDown';
import Button from '../../components/atoms/Button';
import FileSelector from '../../components/molecules/FileSelector';
import TextInput from '../../components/atoms/TextInput';
import dynamic from "next/dynamic";
import Image from 'next/image';
import scanSuccess from "../../assets/images/scanSuccess.png";
import sampleQR from "../../assets/images/sampleQR.png";
import AccountStatement from './tabs/accountStatement';
import OrdersOverview from './tabs/ordersOverview';
import ReturnsOverview from './tabs/returnsOverview';
import StoreActivities from './tabs/storeActivities';
import { postProtected } from '../../requests/postProtected';
import Modal from '../../components/layouts/Modal';
import ButtonLoader from '../../components/atoms/ButtonLoader';
import ErrorBox from '../../components/atoms/ErrorBox';
import { getProtected } from '../../requests/getProtected';
import { useRouter } from 'next/router';
const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const getStatusStyle = (status) => {
    switch (status){
        case "used":
            return styles.returned
        default:
            return styles.completed
    }
}


const Payment = () => {
    // const [activeTab, setActiveTab] = useState("account statement")
    const [activeTab, setActiveTab] = useState("")
    const [showNewProductModal, setShowNewProductModal] = useState(false)
    const [slips, setSlips] = useState([])
    const [allSlips, setAllSlips] = useState([])
    const [selectedSlip, setSelectedSlip] = useState({})
    const [slipID, setSlipID] = useState("")
    const [scanning, setScanning] = useState(false)
    const [scannedSlipDetails, setScannedSlipDetails] = useState({})
    const [requestingPayout, setRequestingPayout] = useState(false)
    const [payoutErrorMessage, setPayoutErrorMessage] = useState("")
    const [payoutSuccess, setPayoutSuccess] = useState(false)
    const [payingOut, setPayingOut] = useState(false)
    const [financial_data, set_financial_data] = useState({
      returns : [],
      payouts: []
    })
    const [returnDetails, setReturnDetails] = useState({})
    const [showReturnDiv, setShowReturnDiv] = useState(false)
    const [returnErrorMessage, setReturnErrorMessage] = useState("")
    const [returnSuccessMessage, setReturnSuccessMessage] = useState("")
    const [showStatusUpdateDiv, setShowStatusUpdateDiv] = useState(true)
    const [orders, set_orders] = useState([])
    const [returns, setReturns] = useState([])
    const [pharmacyData, setPharmacyData] = useState({
        balance : "",
        sales: "",
        returns : "",
        escrow : ""
      })

      const router = useRouter()

      console.log({params: router.query});

      

      useEffect(() => {
        console.log({tab: router?.query?.tab});
        if (router?.query?.tab) {
          if (router.query.tab === "returns") {
            setActiveTab("returns overview")
          } else if (router.query.tab === "orders") {
            setActiveTab("orders overview")
          }
        } else {
          setActiveTab("account statement")
        }
        fetchPharmacyData()
        fetchPharmacyOrders()
      }, [router])

      console.log({financial_data});


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

          }
        } catch (error) {
          console.log({error});
        }
      }

      const fetchPharmacyOrders = async () => {
        try {
          const pharmacy_orders_request = await getProtected("orders/pharmacy/summary")

          if (pharmacy_orders_request && pharmacy_orders_request.status === "OK") {
            let temp = [...orders]
            temp = pharmacy_orders_request.data
            set_orders(temp)
          }
          console.log({orders: pharmacy_orders_request.data});


          console.log({pharmacy_orders_request});
        } catch (error) {
          console.log({error});
        }
      }

    useEffect(() => {
        setSlips(sampleOrders)
        setAllSlips(sampleOrders)
        getFinancialData()

        const availableContraints = navigator.mediaDevices.getSupportedConstraints()
    }, [])

    const setCurrentTab = (currentTab) => {
        var tempOrders = allOrders
        tempOrders = tempOrders.filter(order => order.status.toLowerCase() === currentTab)
        setSlips(tempOrders)
    }

    const setTab = (activeTab) => {
        setActiveTab(activeTab)

        switch(activeTab){
            case "all":
                setSlips(allSlips)
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
        let temp = selectedSlip
        temp = {}
        setSelectedSlip(temp)
        temp = scannedSlipDetails
        temp = {}
        setScannedSlipDetails(temp)
        setScanning(false)
        setSlipID("")
        
    }

    const getTotal = (selectedSlip) => {
        if (selectedSlip.deliveryMethod === "Pick Up"){
            return selectedSlip.price * selectedSlip.quantity
        } else {
            return (selectedSlip.price * selectedSlip.quantity) + selectedSlip.deliveryFee
        }
    }

    const filterActivated = () => {
        	var tempSlips = allSlips
            tempSlips = tempSlips.filter(slip => slip.status.toLowerCase() === "activated")
            setSlips(tempSlips)
    }

    const filterUsed = () => {
        var tempSlips = allSlips
        tempSlips = tempSlips.filter(slip => slip.status.toLowerCase() === "used")
        setSlips(tempSlips)
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

      const getFinancialData = async () => {
        try {
          const financial_data_request = await getProtected("payments/financials")

          let temp = {...financial_data}
          temp = financial_data_request.data
          set_financial_data(temp)

        } catch (error) {
          console.log({error});
        }
      }

      const validateReturnCode = event => {
        event.preventDefault()

        const code = event.target[0].value

        if (!code || String(code).length === 0) {
            setReturnCodeError("Return code is invalid. Please enter the return code you received via email.")
        } else {
            getItemsToReturn(code)
        }
    }

    const getItemsToReturn = async (code) => {
        try {
            console.log({code});
            const getItemsToReturnRequest = await postProtected("orders/validate", {code})

            if (getItemsToReturnRequest.status === "OK") {
                console.log({getItemsToReturnRequest});
                let temp = {...returnDetails}
                temp = getItemsToReturnRequest.data
                setReturnDetails(temp)
            }

            console.log({getItemsToReturnRequest});
        } catch (error) {
            console.log({error});
        }
    }

    const completeProductsReturn = async () => {
        try {
            const completeProductsReturnRequest = await postProtected("orders/returns/complete", {requestID: returnDetails?.request?.id})

            console.log({completeProductsReturnRequest});

            if (completeProductsReturnRequest.status === "OK") {
                setReturnSuccessMessage("Return completed.")
            } else {
                setReturnErrorMessage(completeProductsReturnRequest.error.message)
            }

        } catch (error) {
            console.log({error});
        }
    }

    const closeReturnBox = () => {
        let temp ={...returnDetails}
        temp= {}
        setReturnDetails(temp)
        setReturnErrorMessage("")
        setReturnSuccessMessage("")

        setShowReturnDiv(false)
    }




    return (
        <div className={styles.orders}>

{
                showReturnDiv && <Modal>
                <div className={styles.validateReturnCodeDiv}>
                    <h3>Validate Return Code</h3>

                    {
                        returnErrorMessage && <ErrorBox errorMessage={returnErrorMessage} closeErrorBox={() => setReturnErrorMessage("")} />
                    }

                    {
                        returnSuccessMessage && <SuccessBox successMessage={returnSuccessMessage} closeSuccessBox={() => setReturnSuccessMessage("")} />
                    }

                    <form onSubmit={event => validateReturnCode(event)}>
                        <div className={styles.validateCodeDiv}>
                            <input placeholder='Enter the return code' type='number' max={999999} maxLength={6} />
                            <button>Validate Code</button>
                        </div>
                    </form>

                    {
                        Object.values(returnDetails).length > 0 && <div className={styles.returnDetailsDiv}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        Customer Name
                                    </td>

                                    <td>{returnDetails?.customer?.name}</td>
                                </tr>

                                <tr>
                                    <td>Items to return</td>

                                    <td>
                                        {
                                            returnDetails.request.itemsToReturn.map((item, index) => <p key={index}>{item?.product?.name}</p>)
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className={styles.completeReturnButtonDiv}>
                            <button onClick={() => completeProductsReturn()}>Complete Return</button>
                        </div>
                    </div>
                    }

                    <footer>
                        <button onClick={() => closeReturnBox()}>Close</button>
                    </footer>
                </div>
            </Modal>
            }

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
                (Object.entries(selectedSlip).length > 0) && <SideBar closeSideBar={() => closeSideBar()}>
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

                                <td className={styles.rightCell}>{selectedSlip._id}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Order Date:</td>

                                <td className={styles.rightCell}>{selectedSlip.dateOrdered}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Customer Name:</td>

                                <td className={styles.rightCell}>{selectedSlip.customer.name}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Phone:</td>

                                <td className={styles.rightCell}>{selectedSlip.customer.phoneNumber}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Payment Method:</td>

                                <td className={styles.rightCell}>{selectedSlip.paymentMethod}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Item Name:</td>

                                <td className={styles.rightCell}>{selectedSlip.itemName}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Quantity:</td>

                                <td className={styles.rightCell}>{selectedSlip.quantity}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Order Status:</td>

                                <td className={styles.rightCell}><span><label className={[styles.status, "m0", getStatusStyle(selectedSlip.status)].join(" ")}>{selectedSlip.status.slice(0,1).toUpperCase() + selectedSlip.status.slice(1)}</label></span></td>
                            </tr>

                            {
                                selectedSlip.deliveryMethod !== "Pick Up" && <>
                                <tr>
                                <td className={styles.leftCell}>Delivery Merchant:</td>

                                <td className={styles.rightCell}>{selectedSlip.deliveryMethod}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Delivery Address</td>

                                <td className={styles.rightCell}>{selectedSlip.deliveryAddress}</td>
                            </tr>

                            <tr>
                                <td className={styles.leftCell}>Delivery Fee:</td>

                                <td className={styles.rightCell}>{selectedSlip.deliveryFee}</td>
                            </tr>
                                </>
                            }

                            <tr>
                                <td className={styles.leftCell}>Price:</td>

                                <td className={styles.rightCell}>{selectedSlip.price}</td>
                            </tr>
                        </tbody>
                    </table>

                    <hr />

                    <table>
                        <tbody>
                        <tr>
                                <td className={styles.leftCell}>Total:</td>

                                <td className={styles.total}>{`N ${getTotal(selectedSlip)}`}</td>
                            </tr>
                        </tbody>
                    </table>

                    

                    
                </div>

                <footer className={["displayFlex alignCenter", styles.sidebarFooter].join(" ")}>
                        <DropDown options={["Pending", "Processing", "Completed", "Ready for Delivery/Pick up", "Cancelled", "Declined"]} placeholder={selectedSlip.status.slice(0,1).toUpperCase() + selectedSlip.status.slice(1)} defaultValue={selectedSlip.status.slice(0,1).toUpperCase() + selectedSlip.status.slice(1)} onChange={(e) => handleStatusChange(e)} />
                        <Button label={"Submit"} theme={"solid"} />
                    </footer>

                
            </SideBar>
            }

            <Head>
                <title>Payment | MedUp</title>
            </Head>


            
            <header className='displayFlex jcSpaceBetween'>


                <div className={[styles.headerTabs, 'displayFlex'].join("  ")}>


                    <p className={activeTab === "account statement" ? styles.active : styles.inactive} onClick={() => {
                        setTab("account statement")
                        filterActivated()
                    }}>Account Statement</p>

                    <p className={activeTab === "orders overview" ? styles.active : styles.inactive} onClick={() => {
                        setTab("orders overview")
                        filterUsed()
                    }}>Sales Overview</p>

                    <p className={activeTab === "returns overview" ? styles.active : styles.inactive} onClick={() => {
                        setTab("returns overview")
                        filterUsed()
                    }}>Returns Overview</p>

                    <p className={activeTab === "store activities" ? styles.active : styles.inactive} onClick={() => {
                        setTab("store activities")
                        filterUsed()
                    }}>Store Activities</p>
                </div>

                {
                  activeTab === "returns overview" && <button className={styles.validateReturnCodeButton} onClick={() => setShowReturnDiv(true)}>Validate Return Code</button>
                }
            </header>


            <div>
                    {
                        activeTab === "account statement" && <AccountStatement financial_data={financial_data} showRequestPayout={() => setPayingOut(true)} />
                    }

                    {
                        activeTab === "orders overview" && <OrdersOverview allOrders={orders} />
                    }

                    {
                        activeTab === "returns overview" && <ReturnsOverview returns={financial_data.returns} />
                    }

                    {
                        activeTab === "store activities" && <StoreActivities />
                    }
            </div>

        </div>
    )
}

Payment.getLayout = function getLayout (page) {
    return <LoggedInLayout>
        {page}
    </LoggedInLayout>
}


export default Payment

const OrderTableItem = ({ slip, setSelectedSlip }) => {


    return (
        <tr className={styles.orderTableItem}>
            <td className={styles.image}>
                <p>{slip._id}</p>
            </td>

            <td>
                <p>{slip.customer.name}</p>
            </td>

            <td>
                <p>{(new Date(slip.dateGenerated)).toLocaleDateString("en-NG")}</p>
            </td>

            <td>
                <p className={[getStatusStyle(slip.status), styles.status].join(" ")}>{slip.status.slice(0,1).toUpperCase() + slip.status.slice(1)}</p>
            </td>

            <td>
                <p>{(new Date(slip.dateActivated)).toLocaleDateString("en-NG")}</p>
            </td>

            <td>
                <button onClick={() => setSelectedSlip(slip)}>View Details</button>
            </td>



            
        </tr>
    )
}

const sampleOrders = [
    {
        _id: 1,
        customer: {
            name: "John Doe",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateGenerated : Date.now(),
        dateActivated : Date.now(),
        status: "activated",
    },

    {
        _id: 2,
        customer: {
            name: "Chioma Jesus",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateGenerated : Date.now(),
        dateActivated : Date.now(),
        status: "activated",
    },

    {
        _id: 3,
        customer: {
            name: "Abdulkadir Ahmed",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateGenerated : Date.now(),
        dateActivated : Date.now(),
        status: "used",
    },

    {
        _id: 4,
        customer: {
            name: "Bunmi Adeosun",
            phoneNumber: "08104898400",
            deliveryAddress: "20, Adeola Hopewell Street, Victoria Island, Lagos"
        },
        dateGenerated : Date.now(),
        dateActivated : Date.now(),
        status: "activated",
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


