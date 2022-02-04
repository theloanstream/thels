import '../styles/globals.css'
import {Toaster} from "react-hot-toast";
import { MoralisProvider } from 'react-moralis';

const serverUrl = process.MORALIS_SERVER_URL
const appId = process.env.MORALIS_APP_ID

function MyApp({ Component, pageProps }) {
  return 
  <MoralisProvider appId={appId} serverUrl={serverUrl}>
    <Component {...pageProps} />
  </MoralisProvider>
}

export default MyApp
