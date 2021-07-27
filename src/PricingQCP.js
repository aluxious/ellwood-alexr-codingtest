import './App.css';
import 'react-dropdown/style.css';
import { useEasybase } from 'easybase-react';
import { useState } from 'react'

const uniqueTags = [];

const tableStyle = {
  border: '2px #0af solid',
  borderRadius: 9,
  margin: 3,
  backgroundColor: '#efefef',
  padding: 3,
}

const tradeVolumeStyle = {
  border: '2px #08f solid',
  borderRadius: 9,
  position: 'absolute',
  top: 50,
  left: 100,
  width:200,
  margin: 20,
  backgroundColor: '#cfcfcf',
  padding: 6
}

const ddStyle = {
  position: 'absolute',
  left: 280,
  top: 24,
  fontSize: 21
}  
const titleStyle = {
  position: 'absolute',
  left: 100,
  top: 4,
  fontSize: 21
}  

function PricingQCP() {
    const [ scode, setSecCode ] = useState(false);
    const { db, useReturn, e } = useEasybase();
  
    const { frame } = useReturn(() => {
      if (scode != '')
        return db('ORDERBOOK').return()
          .where(e.eq('code',scode))
          .orderBy({ by: 'volume', sort: 'asc' },{ by: 'price', sort: 'asc' })      
      else
        return db('ORDERBOOK').return()   
    }, [ scode ]);
  
    const buys = frame.filter(c=>c.buysell=='B')
    const sells = frame.sort((a,b)=>a.price-b.price).filter(c=>c.buysell=='S')

    let openPrice = 0
    let openTradeVol = 0
  
    if (scode != '') {
      // calculate pricing 
      const maxBuy = buys.reduce((p, c) => p.value > c.value ? p : c)
      sells.map(s => {
          if (s.price<=maxBuy.price && maxBuy.price>0) {
            openPrice = s.price
            openTradeVol += s.volume
          }
        })
    }
  
    // create dropdown list (don't recreate if already exists)
    if (uniqueTags.length==0)
      uniqueTags.push('');
  
    frame.map(ex => {
        if (uniqueTags.indexOf(ex.code) === -1) {
            uniqueTags.push(ex.code)
        }
    });
  
    uniqueTags.sort()
    // sort to "match" 
    return (
        <div style={ { display: 'flex', flexWrap: 'wrap' } }>
            <p style={ titleStyle }>Choose a security</p>
            <select name="selectList" id="selectList" style={ ddStyle } title="Choose a security" onChange={ obj => setSecCode(obj.target.value) }>
                {uniqueTags.map(ele=>
                    <option value={ ele }>{ele}</option>
            )}
            </select>
            <table>
                <thead>
                    <th>Raw Data</th>
                    <th>Matched</th>
                </thead>
                <tr>
                    <td>
                        <table style={ tableStyle }>
                            <tr>
                                <td>
                                    <div><p><h3>Buy</h3></p></div>
                                    <table style={ tableStyle }>
                                        <tr>
                                            <td>Volume</td>
                                            <td>Price</td>
                                        </tr>
                                        {frame.sort((a,b)=>b.price-a.price).filter(c=>c.buysell=='B' && c.code==scode).map(b =>         
                                            <tr>
                                                <td><small>{String(b.volume).slice(0, 10)}</small></td>
                                                <td><small>{String(b.price).slice(0, 10)}</small> </td>
                                            </tr>
                                        )}
                                    </table>
                                </td>
                                <td>
                                    <div><p><h3>Sell</h3></p></div>
                                    <table style={ tableStyle }>
                                        <tr>
                                            <td>Price</td>
                                            <td>Volume</td>
                                        </tr>
                                        {frame.sort((a,b)=>a.price-b.price).filter(c=>c.buysell=='S' && c.code==scode).map(s =>         
                                            <tr>
                                                <td><small>{String(s.price).slice(0, 10)}</small> </td>                          
                                                <td><small>{String(s.volume).slice(0, 10)}</small></td>
                                            </tr>
                                )}
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <table style={ tableStyle }>
                            <tr>
                                <td>
                                    <div><p><h3>Buy</h3></p></div>
                                    <table style={ tableStyle }>
                                        <tr>
                                            <td>Volume</td>
                                            <td>Price</td>
                                        </tr>
                                        {frame.sort((a,b)=>b.price-a.price).filter(c=>c.buysell=='B' && c.price<=openPrice && c.code==scode).map(b =>         
                                            <tr>
                                                <td><small>{String(b.price==openPrice ? openTradeVol:b.volume).slice(0, 10)}</small></td>
                                                <td><small>{String(b.price).slice(0, 10)}</small> </td>
                                            </tr>
                                         )}
                                    </table>
                                </td>
                                <td>
                                    <div><p><h3>Sell</h3></p></div>
                                    <table style={ tableStyle }>
                                        <tr>
                                            <td>Price</td>
                                            <td>Volume</td>
                                        </tr>
                                        {frame.sort((a,b)=>a.price-b.price).filter(c=>c.buysell=='S' && c.price>=openPrice && c.code==scode).map(s =>         
                                            <tr>
                                                <td><small>{String(s.price).slice(0, 10)}</small> </td>                          
                                                <td><small>{String(s.price==openPrice? openTradeVol:s.volume ).slice(0, 10)}</small></td>
                                            </tr>
                                         )}
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
           
            </table>
            <p style={ tradeVolumeStyle }>
                <div>Security Code=&nbsp;{scode}</div>
                <div>Opening Price=&nbsp;{openPrice}</div>
                <div>Max. Volume=&nbsp;{openTradeVol}</div>
            </p>      
        </div>    
    )
  }
  
export default PricingQCP;