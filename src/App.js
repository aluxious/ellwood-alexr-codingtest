import { EasybaseProvider } from 'easybase-react';
import './App.css';
import ebconfig from './ebconfig';
import PricingQCP from './PricingQCP.js'
import NewOrderButton  from './NewOrderButton.js'

function App() {
  return (
      <div id="wrapper" data-testid="wrapper">
          <div className="App" style={ { display: 'flex', justifyContent: 'center' } }>
              <EasybaseProvider ebconfig={ ebconfig }>
                  <PricingQCP/>
                  <NewOrderButton />
              </EasybaseProvider>      
          </div>
      </div>
  );
}

export default App;
