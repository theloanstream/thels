import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConnectWallet from './ConnectWallet';

const NAV_LINKS = [
  { name: "Dashboard", href: '/dashboard' },
  { name: "Lend", href: '/lend' },
  { name: "Borrow", href: '/borrow' },
]

const styles = {
  header: 'border-b py-4 border-slate-600 ',
  navbar: 'container mx-auto px-4 lg:px-0 flex items-center max-w-screen-lg  justify-between',
  brand: 'text-3xl font-bold',
  navlink: 'text-gray-600 font-medium  hover:text-slate-200 hover:bg-slate-800  px-3 py-1 rounded-xl transition duration-300 ease-out',
  navlinkContainer: 'flex gap-6',
  active: 'text-cyan-400'
}

export const Navbar = () => {
  const { asPath } = useRouter();
  return (
    <header className={styles.header}>
      <nav className={styles.navbar} >
        <h1 className={styles.brand}>Thels</h1>
        <ul className={styles.navlinkContainer}>
          {NAV_LINKS.map((link) => (
            <Link key={link.name} href={link.href}>
              <a className={styles.navlink + " " + (asPath == link.href && (styles.active))}>
                {link.name}
              </a>
            </Link>
          ))}

        </ul>
        <ConnectWallet />
      </nav>
    </header>
  );
};
