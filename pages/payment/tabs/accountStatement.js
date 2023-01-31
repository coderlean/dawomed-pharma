

import { format } from "date-fns"
import { useEffect, useState } from "react"
import { iconsSVGs } from "../../../assets/images/icons"
import Button from "../../../components/atoms/Button"
import DropDown from "../../../components/atoms/DropDown"
import Styles from "../styles/styles.module.css"

export let plain_formatter = Intl.NumberFormat('en')

const AccountStatement = ({showRequestPayout, financial_data}) => {
    const [currentTab, setCurrentTab] = useState("all")
    let formatter = Intl.NumberFormat('en', { notation: 'compact' })
    
    const [total_balance, set_total_balance] = useState(0)
    const [payouts, set_payouts] = useState([])

    useEffect(() => {
        calculate_total_balance()
        setPayoutsList()
    }, [financial_data])

    const calculate_total_balance = () => {
        if (Object.values(financial_data).length > 0) {
            const sales_total = financial_data?.orders_amount + financial_data?.sales_fees
            const refunds_total = financial_data?.refunds_amount + financial_data?.refunds_on_fees
            const commissions_total = financial_data?.commissions_amount + financial_data?.commission_on_return
            const pay_out_total = financial_data?.paid_out_amount

            set_total_balance(sales_total - (refunds_total + commissions_total + pay_out_total))
        }
    }

    const setPayoutsList = () => {
        if (Object.values(financial_data).length > 0) {
            let temp = {...payouts}
            temp = financial_data?.payouts
            set_payouts(temp)


        }
    }

    const getPayoutStatus = status => {
        switch (status) {
            case "Pending":
            return "Pending"
            case "completed":
                return "Paid Out"
                case "Completed":
                    return "Paid Out"
                    case "Under Review": 
                    return "Under Review"
                    default: 
                    return "Not Approved"
        }

    }

    const handleTabChange = tab => {
        setCurrentTab(tab)

        let temp = [...payouts]

        if (tab === "all") {
            temp = financial_data?.payouts
        }

        if (tab === "open") {
            temp = financial_data?.payouts?.filter(item => {
                if (item.status === "Pending" || item.status === "pending") {
                    return item
                }
            })
        }

        if (tab === "paid") {
            temp = financial_data?.payouts?.filter(item => {
                if (item.status === "Completed" || item.status === "completed") {
                    return item
                }
            })
        }

        set_payouts(temp)

    }

    return (
        <div className={Styles.accountStatement}>
            <header >
                <div className={Styles.searchBox}>
                    <input placeholder="Search Transaction" />
                    {
                        iconsSVGs.searchIconGrey
                    }
                </div>

                <div className={Styles.dateBox}>
                    {
                        iconsSVGs.dateGrey
                    }

                    <select>
                        <option>Date Range</option>
                    </select>    
                </div>

                <div className={Styles.printBox}>
                    {
                        iconsSVGs.printerGrey
                    }

                    <p>Print</p>
                </div>

                <div className={Styles.downloadBox}>
                    <Button leftIcon={ iconsSVGs.downloadWhite } label="Download Transactions"  />
                </div>


            </header>

            <hr />

            <main className="displayFlex jcSpaceBetween">
                {/* Main left section */}
                <div className="widthHalf mr20">
                    <div className={Styles.dashboardBoxContainer}>
                        <div className={["widthHalf mr20", Styles.dashboardItem, Styles.availableBalance].join(" ")}>
                            <h3>Available Funds</h3>

                            <div className="displayFlex jcSpaceBetween">
                                <p>{formatter.format(financial_data?.pharmacyFinancials?.balance ? financial_data?.pharmacyFinancials?.balance : 0)} <span>NGN</span></p>

                                <Button label="Request Payout" onButtonClick={() => showRequestPayout()} />
                            </div>
                        </div>

                        <div className={["widthHalf ml20", Styles.dashboardItem, Styles.storePerformance].join(" ")}>
                            <h3>Store Performance</h3>
                            <label>(Last 3 months)</label>

                            <div>

                                <Button theme={"outline"} label="View Report" />
                            </div>
                        </div>
                    </div>
                    
                    <div className={Styles.summaryBox}>
                        <div className="p20">
                            <button onClick={() => handleTabChange("all")} className={currentTab === "all" ? [Styles.tabButton, Styles.tabButtonActive].join(" ") : Styles.tabButton}>ALL</button>
                            <button onClick={() => handleTabChange("open")} className={currentTab === "open" ? [Styles.tabButton, Styles.tabButtonActive].join(" ") : Styles.tabButton}>OPEN</button>
                            <button onClick={() => handleTabChange("paid")} className={currentTab === "paid" ? [Styles.tabButton, Styles.tabButtonActive].join(" ") : Styles.tabButton}>PAID</button>
                        </div>

                        <hr />

                        <table>
                            <thead>
                                <tr>
                                    <td>Period/NR</td>

                                    <td>Status</td>

                                    <td>Payout</td>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    payouts.map((item, index) => <tr key={index}>
                                    <td>
                                        <p>{format(new Date(item.date), "PPP")}</p>
                                        {/* <label>Jkgdlskwe</label> */}
                                    </td>

                                    <td>{getPayoutStatus(item.status)}</td>

                                    <td>{`${plain_formatter.format(item.amount)} NGN`}</td>
                                </tr>)
                                }


                            </tbody>
                        </table>
                    </div>
                </div>






                {/* Main right section */}
                <div className="widthHalf ml20">

                    <div className={[Styles.dashboardBoxContainer, "mb30"].join(" ")}>
                        <div className={["widthHalf mr20", Styles.dashboardItem, Styles.dueBox].join(" ")}>
                            <h3>Due and Paid</h3>
                            <label>(Last 3 months)</label>

                            <div>

                            <p>{formatter.format(financial_data?.paid_out_amount ? financial_data?.paid_out_amount : 0)} <span>NGN</span></p>
                            </div>
                        </div>

                        <div className={["widthHalf ml20", Styles.dashboardItem, Styles.dueBox].join(" ")}>
                            <h3>Due and Unpaid</h3>
                            <label>(Last 3 months)</label>

                            <div>

                                <p>{formatter.format(financial_data?.pharmacyFinancials?.balance ? financial_data?.pharmacyFinancials?.balance : 0)} <span>NGN</span></p>
                            </div>
                        </div>
                    </div>

                    <div className={Styles.summaryBox}>
                        <table className={Styles.statement}>
                            <thead>
                                <tr>
                                    <td>
                                        <label>Current Period</label>
                                        <p>10 Sep 2021 - 30 Sep 2021</p>
                                    </td>

                                    <td>
                                        <label>Statment No.</label>
                                        <p>JQSERTGT</p>
                                    </td>

                                    <td>
                                        <label>Amount</label>
                                    </td>
                                </tr>
                            </thead>

                            <thead>
                                <tr>
                                    <td>
                                        <label>Opening Balance</label>
                                    </td>

                                    <td>
                                        <p>Negative closing balance from previous statements</p>
                                    </td>
                                    
                                    <td>
                                        <label>0.00 NGN</label>
                                    </td>
                                </tr>
                            </thead>

                            <tbody>
                                

                                <tr>
                                    <td>
                                        <p>Orders</p>
                                    </td>

                                    <td>
                                        <div className="displayFlex jcSpaceBetween alignCenter pt10 pb10">
                                            <p>Sales</p>
                                            <p>{`${financial_data?.orders_amount} NGN`}</p>
                                        </div>

                                        <div className="displayFlex jcSpaceBetween alignCenter pt10 pb10">
                                            <p>Fees</p>
                                            <p>{`${financial_data?.sales_fees} NGN`}</p>
                                        </div>

                                        <div className={[Styles.greyCell, "displayFlex jcSpaceBetween alignCenter pt10 pb10"].join(" ")}>
                                            <p className="fw600">Subtotal</p>
                                            <p>{`${financial_data?.orders_amount + financial_data?.sales_fees} NGN`}</p>
                                        </div>
                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <p>Returns</p>
                                    </td>

                                    <td>
                                        <div className="displayFlex jcSpaceBetween alignCenter pt10 pb10">
                                            <p>Refund on returns/canceled orders</p>
                                            <p>{`${financial_data?.refunds_amount} NGN`}</p>
                                        </div>

                                        <div className="displayFlex jcSpaceBetween alignCenter pt10 pb10">
                                            <p>Refund on fees</p>
                                            <p>{`${financial_data?.refunds_on_fees} NGN`}</p>
                                        </div>

                                        <div className={[Styles.greyCell, "displayFlex jcSpaceBetween alignCenter pt10 pb10"].join(" ")}>
                                            <p className="fw600">Subtotal</p>
                                            <p>{`${financial_data?.refunds_on_fees + financial_data?.refunds_amount} NGN`}</p>
                                        </div>
                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <p>Others</p>
                                    </td>

                                    <td>
                                        <div className="displayFlex jcSpaceBetween alignCenter pt10 pb10">
                                            <p>Commission on sales</p>
                                            <p>{`${financial_data?.commissions_amount} NGN`}</p>
                                        </div>

                                        <div className="displayFlex jcSpaceBetween alignCenter pt10 pb10">
                                            <p>Commission on return amount</p>
                                            <p>{`${financial_data?.commission_on_return} NGN`}</p>
                                        </div>

                                        <div className={[Styles.greyCell, "displayFlex jcSpaceBetween alignCenter pt10 pb10"].join(" ")}>
                                            <p className="fw600">Subtotal</p>
                                            <p>{`${financial_data?.commission_on_return + financial_data?.commissions_amount} NGN`}</p>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <p>Pay Out</p>
                                    </td>

                                    <td>
                                        <div className="displayFlex jcSpaceBetween alignCenter pt10 pb10">
                                            <p>Total Paid Out</p>
                                            <p>{`${financial_data?.paid_out_amount} NGN`}</p>
                                        </div>
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <p>Closing Balance</p>
                                    </td>

                                    <td className={[Styles.greyCell].join(" ")}>
                                        <div className={[Styles.greyCell, "displayFlex jcSpaceBetween alignCenter pt10 pb10"].join(" ")}>
                                            <p className="fw600">Total Balance</p>
                                            <p>{total_balance}</p>
                                        </div>
                                    </td>
                                </tr>

                                <tr className={[Styles.greyCell].join(" ")}>
                                    <td>
                                        <p>Payout Amount</p>
                                    </td>

                                    <td>
                                        <div>
                                            <p>0.00NGN</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    )
}

export default AccountStatement