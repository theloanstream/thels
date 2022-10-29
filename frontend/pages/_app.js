import '../styles/globals.css'
import React from 'react'

import { chains, providers } from '@web3modal/ethereum'

// import { MoralisProvider } from 'react-moralis'
import { Toaster } from 'react-hot-toast'
import { Web3Modal } from '@web3modal/react'
import { useAccount, Web3Button } from '@web3modal/react'

const WALLET_CONNECT_PROJECT_ID = "9bd5cf4f1e70e4fd9c5de201e22459f2"

// Get projectID at https://cloud.walletconnect.com
// if (!process.env.REACT_APP_WALLET_CONNECT_ID)
//   throw new Error('You need to provide WALLET_CONNECT_PROJECT_ID env variable')

// Configure web3modal
const config = {
  projectId: WALLET_CONNECT_PROJECT_ID, //process.env.REACT_APP_WALLET_CONNECT_ID,
  theme: 'light',
  accentColor: 'default',
  ethereum: {
    appName: 'web3Modal',
    autoConnect: true,
    chains: [
      chains.mainnet,
      chains.avalanche,
      chains.polygon,
      chains.binanceSmartChain,
      chains.fantom,
      chains.arbitrum,
      chains.optimism
    ],
    providers: [providers.walletConnectProvider({ projectId: WALLET_CONNECT_PROJECT_ID })]
  }
}


function MyApp({ Component, pageProps }) {


  return (
  <>
  <Component {...pageProps} />
  <Web3Modal config={config} />
  </>

    // <MoralisProvider appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID} serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}>
    //   <Toaster position='bottom-right' />
    //   <Component {...pageProps} />
    // </MoralisProvider>
  )

}

export default MyApp
