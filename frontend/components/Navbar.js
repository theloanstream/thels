import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConnectWallet from './ConnectWallet';
import { useAccount, Web3Button } from '@web3modal/react'
import Image from "next/image";


const NAV_LINKS = [
  { name: "Trade", href: '/trade' },
]

const styles = {
  header: ' py-4  ',
  navbar: 'container mx-auto px-4 lg:px-0 flex items-center max-w-screen-lg  justify-between',
  brand: 'text-3xl font-bold cursor-pointer',
  navlink: 'text-slate-300 font-display font-medium hover:text-slate-50 hover:bg-slate-800  px-3 py-1 rounded-xl transition duration-300 ease-out',
  navlinkContainer: 'gap-2 lg:gap-4',
  active: 'text-cyan-400  border-cyan-100'
}

export const Navbar = () => {
  const { asPath } = useRouter();
  return (
    <header className={styles.header}>
      <nav className={styles.navbar} >
      <Image src="/lekker_word.png" alt="Lekker" width="100" height="25" />
        {/* <Link href='/'><h1 className={styles.brand}>Lekker</h1></Link> */}
        <ul className={styles.navlinkContainer}>
          {NAV_LINKS.map((link) => (
            <Link key={link.name} href={link.href}>
              <a className={styles.navlink}>
                {link.name}
              </a>
            </Link>
          ))}

        </ul>
        <Web3Button />
      </nav>
    </header>
  );
};

export default Navbar;