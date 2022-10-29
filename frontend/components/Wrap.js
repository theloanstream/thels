import React, { useState } from 'react';
import Card from './Card';
import Select from './Select';


const data = [
  { id: 0, action: "Long", coin: "ETH", leverage: "2x", networth: 20 },
  { id: 1, action: "Short", coin: "BTC", leverage: "1.5x", networth: 5 },
  { id: 2, action: "Long", coin: "SHIBA", leverage: "2.5x", networth: 3 },
  { id: 3, action: "Short", coin: "DOGE", leverage: "3x", networth: 100 },
]

function Wrap() {
  const [amount, setAmount] = useState(0); // Amount
  const [showForm, setShowForm] = useState(false);
  const [key, setKey] = useState(-1);

  const Form = () => (
    <Card>
      <h1 className='text-2xl font-bold mb-4'>Trade X token for {data[key].coin}</h1>
      <form onSubmit={handleWrap} className='flex gap-4 flex-col'>
        <p className='description'></p>
        {/* Enter amount */}
        <input min={0} value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount" />
        {/* Open position */} 
        <button className='bg-violet-500 hover:bg-violet-400  active:bg-violet-600 shadow-xl'>
          {/* Here check if the values are entered */}
          Open position
        </button> 
      </form> 
    </Card>
  )

  const handleWrap = (e) => {
    var pos = data[key] // Get to data through index using key
    alert(`Form submitted! ${pos.id}`) // Failed: Display the data using key
  }

  const handleTableEnter = (key, e) => {
    setShowForm(true);
    setKey(key);
  }

  var descElement = this.getElementsByClassName("description");
  descElement.innerHTML="Enter amount of coins you want to long";
  // if(data[key].action == "Long"){  // <= you can put your condition here
  //   descElement.innerHTML="Enter amount of coins you want to long";
  // }else if (data[key].action == "Short"){
  //   descElement.innerHTML="Enter amount in USDC to be used as collateral for short"; 
  // }
  // else {
  //   descElement.innerHTML="Error";
  // }

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
              {/* handleTableEnter is triggered all the time */}
              <td><button onClick={() => handleTableEnter(key)}>Enter</button></td> 
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
