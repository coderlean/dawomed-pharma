import { iconsSVGs } from "../../../assets/images/icons"
import Button from "../../../components/atoms/Button"
import DropDown from "../../../components/atoms/DropDown"
import SideBar from "../../../components/layouts/SideBar"
import styles from "../styles/styles.module.css"

const StoreActivities = () => {
    return (
        <div className={styles.orders}>


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

            <div className={[styles.activitiesContainer]}>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <td>FORWARD DELIVERY</td>
                                <td>0 ITEMS</td>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Delivered to customer</td>
                                <td>0</td>
                            </tr>

                            <tr>
                                <td>Delivery to customer failed</td>
                                <td>0</td>
                            </tr>

                            <tr>
                                <td>Handed over to Jumia facilities</td>
                                <td>0</td>
                            </tr>

                            <tr>
                                <td>Went out for delivery to customer</td>
                                <td>0</td>
                            </tr>
                        </tbody>

                        <thead>
                            <tr>
                                <td>IN EXCEPTION</td>
                                <td>0 ITEMS</td>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Item has entered an exception process</td>
                                <td>0</td>
                            </tr>

                            <tr>
                                <td>Item lost</td>
                                <td>0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                <table>
                        <thead>
                            <tr>
                                <td>RETURN DELIVERY</td>
                                <td>0 ITEMS</td>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Customer requested return</td>
                                <td>0</td>
                            </tr>

                            <tr>
                                <td>Customer return arrived in Jumia facilities</td>
                                <td>0</td>
                            </tr>

                            <tr>
                                <td>Return forfeited</td>
                                <td>0</td>
                            </tr>

                            <tr>
                                <td>Return is ready for pickup</td>
                                <td>0</td>
                            </tr>

                            <tr>
                                <td>Return rejected by seller</td>
                                <td>0</td>
                            </tr>

                            <tr>
                                <td>Returns shipped back to customer</td>
                                <td>0</td>
                            </tr>
                        </tbody>

                        <tbody>
                            <tr>
                                <td>Item has entered an exception process</td>
                                <td>0</td>
                            </tr>

                            <tr>
                                <td>Item lost</td>
                                <td>0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default StoreActivities