import '../styles/globals.css'
import "../styles/presets/presets.css"
import {CookiesProvider} from "react-cookie"

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(<CookiesProvider><Component {...pageProps} /></CookiesProvider>)
}

export default MyApp
