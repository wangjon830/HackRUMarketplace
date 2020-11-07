import {BrowserRouter, Route, Link} from 'react-router-dom';
import './styles/App.css';
import './styles/home.css';
import './styles/product.css';

import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';

function App() {

  return (
      <BrowserRouter>
    <div className="App">
        <Navbar/>
        <main>
            <div className="content">
                <Route path="/products/:id" component={ProductScreen}/>
                <Route path="/" exact={true} component={HomeScreen}/>
            </div>
        </main>
        <footer>
            All rights reserved      
        </footer>
    </div>
    </BrowserRouter>
  );
}

export default App;
