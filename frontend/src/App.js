import {BrowserRouter, Route, Link} from 'react-router-dom';
import './styles/App.css';
import './styles/home.css';
import './styles/product.css';

import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import AccountScreen from './screens/AccountScreen';
import SecurityScreen from './screens/SecurityScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import ListingsScreen from './screens/ListingsScreen';

function App() {

  return (
      <BrowserRouter>
    <div className="App">
        <Navbar/>
        <main>
            <div className="content">
                <Route path="/products/:id" component={ProductScreen}/>
                <Route path="/" exact={true} component={HomeScreen}/>
                <Route path="/AccountSettings" exact={true} component={AccountScreen}/>
                <Route path="/SecuritySettings" exact={true} component={SecurityScreen}/>
                <Route path="/TransactionsSettings" exact={true} component={TransactionsScreen}/>
                <Route path="/ListingsSettings" exact={true} component={ListingsScreen}/>
            </div>
        </main>
    </div>
    </BrowserRouter>
  );
}

export default App;
