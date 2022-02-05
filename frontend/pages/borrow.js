import React, { useState } from 'react';
import Card from '../components/Card';
import Container from '../components/Container';
import Navbar from '../components/Navbar';
import StartStream from '../components/StartStream';

function borrow() {
  const [collateralSupplied,setCollateralSupplied] = useState(0);
  const [timeFrame,setTimeFrame] = useState('');
  const [toStreamAddress,setToStreamAddress] = useState('');

  return <div>
    <Navbar />
    <Container>
        {/* Deposit Collateral */}
        <div className='grid gap-4'>
        <Card>
          <div>
            <p className='text-sm text-slate-400 font-medium'>Collateral Deposited</p>
            <h1 className='text-2xl font-bold'> $ {collateralSupplied} </h1>
          </div>
          <div>
            <p className='text-sm text-slate-400 font-medium'>Streamable Balance</p>
            <h1 className='text-2xl font-bold'> $ 4677 </h1>
          </div>
        
        </Card>
        {/* Start / Cancel Stream */}
        <StartStream/>
        {/* Repay Debt */}
        </div>
    </Container>
  </div>;
}

export default borrow;
