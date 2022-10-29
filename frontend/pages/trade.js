import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Container from '../components/Container'
import Card from '../components/Card';
import ABI, { ERC20_ABI } from '../constants/abi';
import Moralis from 'moralis';
import Wrap from '../components/Wrap';
import toast from 'react-hot-toast';
import { THELS_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from '../constants/contractAddress';
import StartStream from '../components/StartStream';
import StopStream from '../components/StopStream';


function trade() {
  const [pending, setPending] = useState(false);
  const [borrowoableAmount, setBorrowableAmount] = useState(0);
  const [collateralAmount, setCollateralAmount] = useState(0);
  const [borrowedAmount, setBorrowedAmount] = useState(0);

  const getDatafromContract = async () => {
    try {
      setPending(true);

      const provider = await Moralis.enableWeb3();
      const ethers = Moralis.web3Library;
      const thelsContract = new ethers.Contract(THELS_CONTRACT_ADDRESS, ABI, provider);
      const userAddress = provider.getSigner().getAddress();

      const _collateralAmount = await thelsContract.getCollateralValue(userAddress);
      setCollateralAmount((_collateralAmount / ethers.constants.WeiPerEther).toFixed(2).toString())

      const _borrowableAmount = await thelsContract.getBorrowableAmount(userAddress);
      setBorrowableAmount((_borrowableAmount / ethers.constants.WeiPerEther).toFixed(2).toString());

      const _borrowedAmount = await thelsContract.borrowAmounts(userAddress);
      setBorrowedAmount((_borrowedAmount / ethers.constants.WeiPerEther).toFixed(2).toString());

    } catch (err) {
      toast.error(err.message);
      console.error(err)
    }
  }

  const _repayDebt = async () => {
    try {
      setPending(true);
      const provider = await Moralis.enableWeb3();
      const signer = provider.getSigner();
      const ethers = Moralis.web3Library;
      const thelsContract = new ethers.Contract(THELS_CONTRACT_ADDRESS, ABI, signer);
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, ERC20_ABI, signer);
      const allowance = await usdcContract.allowance(await signer.getAddress(), THELS_CONTRACT_ADDRESS);
      if (allowance == 0) {
        let tx = await usdcContract.approve(THELS_CONTRACT_ADDRESS, ethers.constants.MaxUint256);
        await tx.wait();
      }
      const tx = await thelsContract.repay(await thelsContract.borrowAmounts(await signer.getAddress()));
      await tx.wait();
      toast.success("Transaction Confirmed 🎉🎉")
      setPending(false);
    } catch (err) {
      toast.error(err.message);
      setPending(false);
      console.log(err);
    }
  }

  useEffect(() => {
    getDatafromContract();
  }, [])

  const handlePosition = (e) => {
    console.log("Handle position: ", e)
  }

  // Dummy data
  const amount = 0;

  return <>
    <Navbar />
    <Container>
      <div className='grid gap-4 md:grid-cols-4 mt-16'>
        <div className='col-span-2 grid gap-4'>
          <Wrap />
        </div>

        <div className="col-span-2 grid gap-4">
          <Card>
            <h1 className='text-2xl font-bold mb-4'>Trade</h1>
            <form onSubmit={handlePosition} className='flex gap-4 flex-col'>
              <input min={0} value={amount} onChange={(e) => setAmount(e.target.value)} type="number" />
              <button className='bg-violet-500 hover:bg-violet-400  active:bg-violet-600 shadow-xl'>
              </button>
            </form>
          </Card>
        </div>
        <div className='col-span-2'>
        </div>
      </div>
    </Container>
  </>;
}

export default trade;
