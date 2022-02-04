import '../styles/globals.css'
import {Toaster} from "react-hot-toast";
import { MoralisProvider } from 'react-moralis';
import Navbar from '../components/Navbar'

const serverUrl = process.MORALIS_SERVER_URL
const appId = process.env.MORALIS_APP_ID

function MyApp({ Component, pageProps }) {
  return 
  <MoralisProvider appId={appId} serverUrl={serverUrl}>
    <Toaster position='bottom-right'/>
    <Navbar/>
    <Component {...pageProps} />
  </MoralisProvider>
}

export default MyApp
