import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {observer} from "mobx-react";
import UserStore from './stores/UserStore';

import './styles/App.css';
import './styles/home.css';
import './styles/Login.css';
import './styles/product.css';
import './styles/Navbar.css';
import './styles/AccountDropdown.css';
import './styles/Account.css';

import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProductScreen from './screens/ProductScreen';
import AccountScreen from './screens/AccountScreen';
import SecurityScreen from './screens/SecurityScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import ListingsScreen from './screens/ListingsScreen';

const App = () => {
    return (
        <BrowserRouter>
        <div className="App">
            <Navbar/>
            <main>
            <Route path="/" exact={true} component={HomeScreen}/>
                <Route path="/products/:id" component={ProductScreen}/>
                <Route path="/login" component={LoginScreen}/>
                <Route path="/settings/account" exact={true} component={AccountScreen}/>
                <Route path="/settings/security" exact={true} component={SecurityScreen}/>
                <Route path="/settings/transaction" exact={true} component={TransactionsScreen}/>
                <Route path="/settings/listings" exact={true} component={ListingsScreen}/>
            </main>
            <footer>
                All rights reserved      
            </footer>
        </div>
        </BrowserRouter>
    );
}

export default observer(App);
