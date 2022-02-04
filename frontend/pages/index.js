import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
       <Head>
        <title>Thels</title>
        <meta name="description" content="Thels - the loan stream" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
