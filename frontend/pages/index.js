import Head from 'next/head'
import HeroSection from '../components/HeroSection'
import Container from '../components/Container'
import Navbar from '../components/Navbar'
import { useMoralis } from 'react-moralis';

import { Web3Modal } from '@web3modal/react'
import { useAccount, Web3Button } from '@web3modal/react'

const config = {
  projectId: '9bd5cf4f1e70e4fd9c5de201e22459f2',
  theme: 'dark',
  accentColor: 'default',
  ethereum: {
    appName: 'web3Modal'
  }
}




export default function Home() {


  return (
    <div className='min-h-screen flex flex-col'>
      <Head>
        <title>Thels</title>
        <meta name="description" content="Thels - the loan stream" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main >
        <Container>

          <HeroSection />

        </Container>
        <Web3Modal config={config} />
      </main>
    </div>
  )
}
