import '../styles/globals.css'

import { MoralisProvider } from 'react-moralis'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }) {

  return (
    <MoralisProvider appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID} serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}>
      <Toaster position='bottom-right'/>
      
      <Component {...pageProps} />
    </MoralisProvider>
  )

}

export default MyApp
