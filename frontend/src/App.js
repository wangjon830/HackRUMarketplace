import React from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import UserStore from './stores/UserStore'
import {observer} from 'mobx-react'

import './styles/App.css';
import './styles/home.css';
import './styles/login.css';
import './styles/product.css';

import Navbar from './components/Navbar';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProductScreen from './screens/ProductScreen';

class App extends React.Component {
    async componentDidMount(){
        try {
            let res = await fetch('/isLoggedIn', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            let result = await res.json();

            if (result && result.success){
                UserStore.loading = false;
                UserStore.isLoggedIn = true;
                UserStore.email = result.email;
            }
            else{
                UserStore.loading = false;
                UserStore.isLoggedIn = false;
            }
        }
        catch(e){
            UserStore.loading = false;
            UserStore.isLoggedIn = false;
        }
    }

    async doLogout(){
        try {
            let res = await fetch('/logout', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            let result = await res.json();

            if (result && result.success){
                UserStore.isLoggedIn = false;
                UserStore.email = '';
            }
        }
        catch(e){
            console.log(e);
        }
    }

    render(){
        return (
            <BrowserRouter>
          <div className="App">
              <Navbar/>
              <main>
                <Route path="/" exact={true} component={HomeScreen}/>
                    <Route path="/products/:id" component={ProductScreen}/>
                    <Route path="/login" component={LoginScreen}/>
              </main>
              <footer>
                  All rights reserved      
              </footer>
          </div>
          </BrowserRouter>
        );
    }
  
}

export default observer(App);
