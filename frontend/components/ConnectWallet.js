import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { DuplicateIcon } from '@heroicons/react/outline'
import toast from 'react-hot-toast';


const shortenAddress = (address) => {
  return address.slice(0, 4) + " . . . " + address.slice(-5, -1);
}

const btnStyle = "bg-cyan-500 hover:shadow-2xl hover:bg-cyan-400 active:bg-cyan-600 text-white flex gap-2 items-center"

const copyToClipboard = (str) => {
  navigator.clipboard.writeText(str);
  toast.success("Copied to Clipboard!")
}

const ConnectWallet = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const { authenticate, isAuthenticated, user } = useMoralis();

  useEffect(() => {
    if(window.ethereum){
      console.log(window.ethereum);
    }
    if(isAuthenticated){
      setWalletAddress(user.get('ethAddress'));
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <button onClick={() => authenticate()} className={btnStyle}>
        "Connect Wallet"
      </button>
    );
  }
  return (
    <button disabled className={btnStyle}>
      {shortenAddress(walletAddress)}
      <DuplicateIcon onClick={()=>copyToClipboard(walletAddress)} className='w-5 h-5 cursor-pointer hover:scale-110 transition duration-100 ease-out' />
    </button>
  )
}

export default ConnectWallet;
