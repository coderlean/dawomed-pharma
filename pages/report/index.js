import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
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
import LoggedInLayout from '../../components/layouts/LoggedInLayout/loggedinLayout';
import { getProtected } from '../../requests/getProtected';
import styles from "./styles/styles.module.css"
import { getCapitalizedString } from '../products';
import { iconsSVGs } from '../../assets/images/icons';
import Head from 'next/head';

const Report = () => {
    const [stats, setStats] = useState({
        salesStats : [],
        ordersStats : [],
        top_views : [],
        most_ordered : []
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

    useEffect(() => {
        fetchReports()
    }, [])

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

      const salesData = {
        labels: [],
        datasets : [
          {
            label: 'Sales',
            data: stats.salesStats,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ]
      }

      const ordersData = {
        labels : [],
        datasets : [
          {
            label: 'Orders',
            data: stats.ordersStats,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ]
      }

      console.log({stats});


    const fetchReports = async () => {
        try {
            const fetchReportsRequest = await getProtected("reports")

            console.log(fetchReportsRequest);

            if (fetchReportsRequest && fetchReportsRequest.status && fetchReportsRequest.status === "OK") {
                console.log({fetchReportsRequest});
                let temp = {...stats}
                temp["top_views"] = fetchReportsRequest.data.top_views
                temp["most_ordered"] = fetchReportsRequest.data.most_ordered_items
                temp["ordersStats"] = fetchReportsRequest.data.ordersStats
                temp["salesStats"] = fetchReportsRequest.data.salesStats
                setStats(temp)
            }

            
        } catch (error) {
            console.log({error});
        }
    }

    return (
        <div className={styles.report}>
            <Head>
                <title>Reports</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <header>
                    <div>
                        <h3>Sales Report</h3>
                        <p>Review of sales activities</p>
                    </div>

                    <button>
                        {
                            iconsSVGs.downloadWhite
                        }
                        Download Report
                    </button>
                </header>
            <div className={styles.report_container}>
                
            <div>
                <div>
                    <Line options={options} data={ordersData} />
                </div>

                <div className={styles.statTable}>
                    <header>
                        <p>Most Ordered Items</p>
                    </header>

                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <td>ITEM</td>
                                    <td className={styles.right}>UNITS</td>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    stats.most_ordered.map((item, index) => <tr key={index}>
                                    <td>{getCapitalizedString(item.product[0].name ? item.product[0].name : "")}</td>
                                    <td>{item.count}</td>
                                </tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div>
                <div>
                    <Line options={options} data={salesData} />
                </div>

                <div className={styles.statTable}>
                    <header>
                        <p>Most Viewed Items</p>
                    </header>

                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <td>ITEM</td>
                                    <td>VIEWS</td>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    stats.top_views.map((item, index) => <tr key={index}>
                                    <td>{getCapitalizedString(item._id.name ? item._id.name : "")}</td>
                                    <td>{item.count}</td>
                                </tr>)
                                }
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

Report.getLayout = function getLayout (page) {
    return <LoggedInLayout>
        {page}
    </LoggedInLayout>
}


export default Report