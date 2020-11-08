import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {observer} from "mobx-react";
import UserStore from './stores/UserStore';

import './styles/App.css';
import './styles/home.css';
import './styles/Login.css';
import './styles/Item.css';
import './styles/Navbar.css';
import './styles/AccountDropdown.css';
import './styles/NotificationDropdown.css';
import './styles/Account.css';
import './styles/MakeListing.css'

import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ItemScreen from './screens/ItemScreen';
import AccountScreen from './screens/AccountScreen';
import SecurityScreen from './screens/SecurityScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import ListingsScreen from './screens/ListingsScreen';
import MakeListingScreen from './screens/MakeListingScreen';
import WatchlistScreen from './screens/WatchlistScreen';

const App = () => {
    return (
        <BrowserRouter>
        <div className="App">
            <Navbar/>
            <main>
            <Route path="/" exact={true} component={HomeScreen}/>
                <Route path="/listings/:id" component={ItemScreen}/>
                <Route path="/login" component={LoginScreen}/>
                <Route path="/settings/account" exact={true} component={AccountScreen}/>
                <Route path="/settings/security" exact={true} component={SecurityScreen}/>
                <Route path="/settings/transaction" exact={true} component={TransactionsScreen}/>
                <Route path="/settings/listings" exact={true} component={ListingsScreen}/>
                <Route path="/makeListing" exact={true} component={MakeListingScreen}/>
                <Route path="/watchlist" exact={true} component={WatchlistScreen}/>
            </main>
            <footer>
                All rights reserved      
            </footer>
        </div>
        </BrowserRouter>
    );
}

export default observer(App);
