import React from 'react';
import Navbar from '../components/Navbar';
import Container from '../components/Container'
import Card from '../components/Card';



function dashboard() {
  return <>
    <Navbar />
    <Container>
      <div className='grid  gap-4'>
        <Card>        
          <div className='flex justify-around items-center gap-4'>
          <div>
            <p className='text-slate-400 text-sm font-medium mb-2'>Your Balance in USD</p>
            <h1 className='text-4xl tracking-wider'> $ 999</h1>
          </div>
          <div>
            <p className='text-slate-400 text-sm font-medium mb-2'>Total Collateral Supplied </p>
            <h1 className='text-4xl tracking-wider'> $ 999</h1>
          </div>
          <div>
            <p className='text-slate-400 text-sm font-medium mb-2'>Daily Net Flow in USD</p>
            <h1 className='text-4xl tracking-wider'> $ 999</h1>
          </div>
        </div>
        </Card>
        <Card>
          <h1 className='font-body mb-2 text-xl font-semibold'>Current Streams</h1>
          <div className='flex p-2 text-xs font-semibold bg-slate-600 rounded-xl items-center justify-around'>
            <h6>From</h6>
            <h6>To</h6>
            <h6>Start/End Date</h6>
            <h6>Incoming/Outgoing  per month</h6>
            <h6>Streamed so far in USD</h6>
          </div>
        </Card>

      </div>
    </Container>
  </>;
}

export default dashboard;
