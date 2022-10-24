import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import LoggedInLayout from '../../components/layouts/LoggedInLayout/loggedinLayout';
import Accordion from '../../components/molecules/Accordion';

const Account = () => {


    return (
        <div>
            <div>
                <p>Account Settings</p>
            </div>

            <div>
                <Accordion title={"Account Information"} >
                    <form>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label>Pharma ID</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy ID' />
                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <label>Pharmacy Name</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy Name' />
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <label>Email Address</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy ID' />
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <label>Contact Number</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy ID' />
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <label>Contact Number 2</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy ID' />
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <label>Account Manager Name</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy ID' />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </Accordion>

                <Accordion title={"Store Logo"} >

                </Accordion>

                <Accordion title={"Pharmacy Information"} >
                    <form>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label>Pharmacy Registration Number</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy ID' />
                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <label>Name of Pharmacy</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy Name' />
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <label>Address 1</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy ID' />
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <label>Address 2</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy ID' />
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <label>State</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy ID' />
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <label>LGA</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy ID' />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <label>Business Owner DOB</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy ID' />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <label>Are you VAT registered?</label>
                                    </td>

                                    <td>
                                        <input placeholder='Pharmacy ID' />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </Accordion>

                <Accordion title={"Documentation"} >

                </Accordion>

                <Accordion title={"Bank Details"} >

                </Accordion>

                <Accordion title={"Security/Authentication"} >

                </Accordion>
            </div>
        </div>
    )
}

Account.getLayout = function getLayout (page) {
    return <LoggedInLayout>
        {page}
    </LoggedInLayout>
}


export default Account

