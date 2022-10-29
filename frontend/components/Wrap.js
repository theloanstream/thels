import React, { useState } from 'react';
import Card from './Card';
import Select from './Select';


const data = [
  { action: "Long", coin: "ETH", leverage: "2x", networth: 20 },
  { action: "Short", coin: "BTC", leverage: "1.5x", networth: 5 },
]

function Wrap() {
  const [type, setType] = useState(data[0]); // Position type
  const [amount, setAmount] = useState(0); // Amount
  const [showForm, setShowForm] = React.useState(false);

  const Form = () => (
    <Card>
      <h1 className='text-2xl font-bold mb-4'>Trade</h1>
      <form onSubmit={handleWrap} className='flex gap-4 flex-col'>
        {/* Enter amount */}
        <input min={0} value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder={`${type.from} amount`} />
        {/* Open position */}
        <button className='bg-violet-500 hover:bg-violet-400  active:bg-violet-600 shadow-xl'>
          {/* Here check if the values are entered */}
          Open position
        </button> 
      </form>
    </Card>
  )

  const handleWrap = (e) => {
    console.log("Form submitted!", e)
  }

  const handleTableEnter = (key, e) => {
    console.log("Position chosen", key, e)
    setShowForm(true);
  }

  return (
    <div>
      {/* A table with all available positions */}
      <div className="App">
      <table>
        <tr>
          <th>Action</th>
          <th>Coin</th>
          <th>Leverage</th>
          <th>Networth</th>
        </tr>
        {data.map((val, key) => {
          return (
            <tr key={key}>
              <td><button onClick={handleTableEnter(key)}>Enter</button></td>
              <td>{val.action}</td>
              <td>{val.coin}</td>
              <td>{val.leverage}</td>
              <td>{val.networth}</td>
            </tr>
          )
        })}
      </table>
    </div>

    {/* Show this form when the user has chosen a position from the table above */}
    { showForm ? <Form /> : null }
    </div>
  )
}

export default Wrap;
