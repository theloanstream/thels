import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Container from '../components/Container'
import Card from '../components/Card';
import ABI from '../constants/abi';
import Moralis from 'moralis';
import Wrap from '../components/Wrap';
import toast from 'react-hot-toast';
import { THELS_CONTRACT_ADDRESS, USDCX_CONTRACT_ADDRESS } from '../constants/contractAddress';
import StartStream from '../components/StartStream';
import Deposit from '../components/Deposit';
import StopStream from '../components/StopStream';
import Withdraw from '../components/Withdraw';
import { useMoralis } from 'react-moralis';


function dashboard() {
  const [pending, setPending] = useState(false);
  const [borrowoableAmount, setBorrowableAmount] = useState(0);
  const [collateralAmount, setCollateralAmount] = useState(0);
  const [balance,setBalance] = useState(0);


  const getDatafromContract = async () => {
    try {
      setPending(true);

      const provider = await Moralis.enableWeb3();
      const ethers = Moralis.web3Library;
      const thelsContract = new ethers.Contract(THELS_CONTRACT_ADDRESS, ABI, provider);
      const userAddress = provider.getSigner().getAddress();

      const _collateralAmount = await thelsContract.getCollateralValue(userAddress);
      setCollateralAmount((_collateralAmount / ethers.constants.WeiPerEther).toString())

      const _borrowableAmount = await thelsContract.getBorrowableAmount(userAddress);
      setBorrowableAmount((_borrowableAmount / ethers.constants.WeiPerEther).toString());
    } catch (err) {
      toast.error(err.message);
      console.error(err)
    }
  }


  useEffect(() => {
      getDatafromContract();
  }, [])


  return <>
    <Navbar />
    <Container>
      <div className='grid gap-4 md:grid-cols-4 mt-16'>
        <div className='col-span-2 grid gap-4'>
          <Wrap />
          <StopStream />
        </div>
 
        <div className="col-span-2 grid gap-4">
            <Card>
            <div className='flex gap-4 justify-around flex-wrap'>
              <div>
                <p className='text-sm text-slate-400 font-medium mb-1'>Total Borrowable Amount </p>
                <h1 className='text-2xl font-bold'> $ {borrowoableAmount} </h1>
              </div>
              <div>
                <p className='text-sm text-slate-400 font-medium mb-1'>Collateral Deposited </p>
                <h1 className='text-2xl font-bold'> $ {collateralAmount} </h1>
              </div>
            </div>
          </Card>
          <StartStream />
        </div>
        <div className='col-span-2'>
        </div>
      </div>
    </Container>
  </>;
}

export default dashboard;
