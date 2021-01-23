import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import './styles/App.css';
import './styles/Settings.css';

import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ItemScreen from './screens/ItemScreen';
import EditItemScreen from './screens/EditItemScreen';
import AccountScreen from './screens/AccountScreen';
import EditAccountScreen from './screens/EditAccountScreen';
import SecurityScreen from './screens/SecurityScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import ListingsScreen from './screens/ListingsScreen';
import MakeListingScreen from './screens/MakeListingScreen';
import WatchlistScreen from './screens/WatchlistScreen';
import ResultsScreen from './screens/ResultsScreen';

const App = () => {
    return (
        <BrowserRouter>
        <div className="App">
            <Navbar/>
            <main>
                <Route path="/" exact={true} component={HomeScreen}/>
                <Route path="/listings/:id" component={ItemScreen}/>
                <Route path="/edit/:id" component={EditItemScreen}/>
                <Route path="/account/:id" component={AccountScreen}/>
                <Route path="/login" component={LoginScreen}/>
                <Route path="/settings/account" exact={true} component={EditAccountScreen}/>
                <Route path="/settings/security" exact={true} component={SecurityScreen}/>
                <Route path="/settings/transactions" exact={true} component={TransactionsScreen}/>
                <Route path="/makeListing" exact={true} component={MakeListingScreen}/>
                <Route path="/listings" exact={true} component={ListingsScreen}/>
                <Route path="/watchlist" exact={true} component={WatchlistScreen}/>
                <Route path="/search" exact={true} component={ResultsScreen}/>
            </main>
        </div>
        </BrowserRouter>
    );
}

export default App;
