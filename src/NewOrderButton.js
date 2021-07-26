import { useEasybase } from 'easybase-react';

function NewOrderButton() {
    const { Frame, sync } = useEasybase();
  
    const buttonStyle = {
      position: 'absolute',
      left: 100,
      top: 100,
      fontSize: 21
    }
  
    const handleClick = () => {
      const newCode = prompt('Please enter your security code');
      const buysell = prompt('Please input either buy/sell (b/s)');
      const volume = prompt('Please input volume');
      const pricing = prompt('Please input pricing');
      
      if (newCode!=null && buysell!=null &&  volume!=null && pricing!=null) {
        Frame().push({
          code: newCode.toUpperCase(),
          buysell: buysell.toUpperCase()[ 0 ],
          volume: volume,
          price: pricing,
          createdate: new Date().toISOString(),
          createtime: new Date().toTimeString(),
        })
        alert('New record saved. Please re-select a Security code.')
      }
      sync();
    }
  
    return <button style={ buttonStyle } onClick={ handleClick }>📓 Add New Order 📓</button>
  }

export default NewOrderButton;