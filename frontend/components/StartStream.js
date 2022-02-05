import React, { useState, Fragment, useRef, useEffect } from 'react';
import Card from './Card';
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon, CheckIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast'

const durations = [
  { id: 1, name: '/ hour' , inSeconds: 3600 },
  { id: 2, name: '/ day' ,inSeconds: 60*60*24 },
  { id: 3, name: '/ week',inSeconds: 60*60*24*7 },
  { id: 4, name: '/ month',inSeconds: 60*60*24*30},
  { id: 5, name: '/ year',inSeconds: 60*60*24*365},
]

function StartStream() {
  const [selectedDuration, setSelectedDuration] = useState(durations[0]);
  const [amountPerSecond,setAmountPerSecond] = useState(0);
  const [amount,setAmount] = useState(0);

  const startStream = (e) => {
    e.preventDefault();
    const receiverAddress = e.target[0].value;
    console.log({receiverAddress,amount,amountPerSecond})
    toast.success('Stream Started');
  }

  useEffect(()=>{
    const durationInSeconds = selectedDuration.inSeconds;
    setAmountPerSecond((amount/durationInSeconds).toFixed(5));
  },[amount,selectedDuration])

  return <Card>
    <h1 className='text-2xl font-bold mb-4'>Start a new stream</h1>
    <form onSubmit={(e)=>startStream(e)} className='grid grid-cols-2 gap-4'>
      <div className='flex col-span-2 flex-col'>
        <input name='receiver_address' placeholder="Receiver's address " type="text" />
      </div>
      <div className='flex grid-cols-1 flex-col relative'>
        <div className='top-2 left-4 font-medium text-slate-200 left- absolute'>$</div>
        <input name="amount" value={amount} onChange={(e)=>setAmount(e.target.value)}  className='pl-8 ' type='number' step="0.10" placeholder="0.00" />
      </div>
      <div>
        <Listbox value={selectedDuration} onChange={setSelectedDuration}>
          <div className="relative">
            <Listbox.Button className="relative w-full py-2 pl-4 pr-10 text-left active:scale-[98%] bg-slate-800 active:bg-slate-900 ring-1 ring-slate-500  active:bg-opacity-50 bg-opacity-50 rounded-xl cursor-pointer focus:ring-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75  focus-visible:ring-cyan-500">
              <span className="block truncate">{selectedDuration.name}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute w-full z-10 py-2 mt-2 overflow-auto text-base bg-slate-800 rounded-xl shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {durations.map((item) => (
                  <Listbox.Option
                    key={item.id}
                    className={({ active }) =>
                      `${active ? 'text-cyan-400' : 'text-slate-200'}
                          cursor-default select-none hover:bg-slate-900 relative py-2 pl-10 pr-4`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`${selected ? 'font-medium' : 'font-normal'
                            } block truncate`}
                        >
                          {item.name}
                        </span>
                        {selected ? (
                          <span
                            className={`${active ? 'text-cyan-500' : 'text-cyan-500'
                              }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                          >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      <h1 className='text-2xl col-span-2 font-bold'>$ {amountPerSecond}  <span className='text-sm font-normal relative -top-1 text-gray-300'> / second </span></h1>      
        <button type="submit" className='whitespace-nowrap col-span-2 text-center bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600'>Start Streaming</button>
    </form >
  </Card >;
}

export default StartStream;
