import { EasybaseProvider, useEasybase } from 'easybase-react';
import './App.css';
import { useState } from "react"
import 'react-dropdown/style.css';
import ebconfig from './ebconfig';


function App() {
  return (
    <div className="App" style={{ display: "flex", justifyContent: "center" }}>
      <EasybaseProvider ebconfig={ebconfig}>
        <PricingQCP/>
        <NewOrderButton />
      </EasybaseProvider>      
    </div>
  );
}
const uniqueTags = [];

const noteRootStyle = {
  border: "2px #0af solid",
  borderRadius: 9,
  margin: 20,
  backgroundColor: "#efefef",
  padding: 6,
}

const noteRootStyle2 = {
  border: "2px #08f solid",
  borderRadius: 9,
  position: "absolute",
  top: 150,
  left: 0,
  margin: 20,
  backgroundColor: "#cfcfcf",
  padding: 6
}

const ddStyle = {
  position: "absolute",
  left: 180,
  top: 24,
  fontSize: 21
}  
const titleStyle = {
  position: "absolute",
  left: 0,
  top: 0,
  fontSize: 21
}  

function PricingQCP() {
  const [scode, setSecCode] = useState(false);
  const { db, useReturn, e , sync} = useEasybase();

  const { frame } = useReturn(() => {
    if (scode != '')
      return db('ORDERBOOK').return()
        .where(e.eq('code',scode))
        .orderBy({ by: "volume", sort: "asc" },{ by: "price", sort: "asc" })      
    else
      return db('ORDERBOOK').return()   
  }, [scode]);


  const buys = frame.filter(c=>c.buysell=='B')
  const sells = frame.filter(c=>c.buysell=='S')

  let op_price = 0
  let op_vol = 0
  buys.map(b=>
    sells.map(s=>{
      if (b.price<=s.price && b.price>op_price){
        op_price = b.price
        op_vol = b.volume
      }
    })
    )

  if (uniqueTags.length==0)
    uniqueTags.push('');

  frame.map(ex => {
      if (uniqueTags.indexOf(ex.code) === -1) {
          uniqueTags.push(ex.code)
      }
  });
  
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <p style={titleStyle}>Choose a security</p>
      <select name="selectList" id="selectList" style={ddStyle} title="Choose a security" onChange={e => setSecCode(e.target.value)}>
      {uniqueTags.map(e=>
          <option value={e}>{e}</option>
      )}
      </select>
      <p>
        <div style={noteRootStyle}><p><h3>Buy</h3></p></div>
        <table  style={noteRootStyle}>
          <th>Volume</th>
          <th>Price</th>
          {frame.filter(c=>c.buysell=='B').map(e =>         
              <tr>
              <td><small>{String(e.volume).slice(0, 10)}</small></td>
              <td><small>{String(e.price).slice(0, 10)}</small> </td>
              </tr>
          )}
        </table>
      </p>
      <p>
        <div style={noteRootStyle}><p><h3>Sell</h3></p></div>
        <table  style={noteRootStyle}>
          <th>Volume</th>
          <th>Price</th>
          {frame.filter(c=>c.buysell=='S').map(e =>         
              <tr>
              <td><small>{String(e.volume).slice(0, 10)}</small></td>
              <td><small>{String(e.price).slice(0, 10)}</small> </td>
              </tr>
          )}
        </table>
      </p>
      <p style={noteRootStyle2}>
        <div>Opening Price=&nbsp;{op_price}</div>
        <div>Max. Volume=&nbsp;{op_vol}</div>
      </p>      
    </div>    
  )
}

function NewOrderButton() {
  const { Frame, sync } = useEasybase();

  const buttonStyle = {
    position: "absolute",
    left: 0,
    top: 100,
    fontSize: 21
  }

  const handleClick = () => {
    const newCode = prompt("Please enter your security code");
    const buysell = prompt("Please input either buy/sell (b/s)");
    const volume = prompt("Please input volume");
    const pricing = prompt("Please input pricing");
    
    Frame().push({
      code: newCode.toUpperCase(),
      buysell: buysell.toUpperCase()[0],
      volume: volume,
      price: pricing,
      createdate: new Date().toISOString(),
      createtime: new Date().toTimeString(),
    })
    
    sync();
  }

  return <button style={buttonStyle} onClick={handleClick}>📓 Add New Order 📓</button>
}

export default App;
