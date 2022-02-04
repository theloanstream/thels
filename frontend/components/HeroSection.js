import { ArrowRightIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';
function HeroSection() {
  return (
    <div className='grid lg:grid-cols-2 mt-12 gap-8 px-4 lg:px-0 items-center justify-center'>
      <div className='flex  flex-col justify-center'>
        <h1 className='text-4xl lg:text-6xl font-bold mb-6' >
          The Loan Stream
        </h1>
        <p className='mb-6 text-slate-400 max-w-lg lg:text-lg'> Allows DAOs with large treasuries & DeFi users to collateralize their treasuries , and take out loans in the form of streams - without having to sell assets to do so.</p>
        <div>
        <Link href='/dashboard'>
          <button className='flex gap-2 hover:gap-4 items-center bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600'>Go to Dashboard
            <ArrowRightIcon className='h-4 w-4' />
          </button>
        </Link>
        </div>

      </div>
      <div>
        <img className='p-4' src='/hero-image-2.png' layout='fill' alt='hero-image' />
      </div>

    </div>
  );
}

export default HeroSection;
