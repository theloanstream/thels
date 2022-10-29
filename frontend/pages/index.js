import Head from 'next/head'
import HeroSection from '../components/HeroSection'
import Container from '../components/Container'
import Navbar from '../components/Navbar'





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
      
      </main>
    </div>
  )
}
