import '../styles/globals.css'
import "../styles/presets/presets.css"
import {CookiesProvider} from "react-cookie"
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(<CookiesProvider>
     <Head>
                <title>Reports</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
    <Component {...pageProps} /></CookiesProvider>)
}

export default MyApp
