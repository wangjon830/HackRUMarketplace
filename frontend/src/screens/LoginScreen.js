import React from 'react';
import {Link} from 'react-router-dom';
import UserStore from '../stores/UserStore'

class LoginScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            buttonDisabled: false
        }
    }

    setInput(property, val){
        val = val.trim();
        // if(val.length > 20){
        //     return;
        // }
        this.setState({
            [property]:val
        })
    }

    resetForm(){
        this.setState({
            username: '',
            password: '',
            buttonDisabled: false
        })
    }

    async doLogin(){
        if(!this.state.username){
            return;
        }
        if(!this.state.password){
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try{
            let res = await fetch('/login', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            })

            let result = await res.json();
            if(result && result.success){
                UserStore.isLoggedIn = true;
                UserStore.username = result.username;
            }
            else if(result && result.success === false){
                this.resetForm();
                alert(result.msg);
            }
        }
        catch(e){
            console.log(e);
            this.resetForm();
        }
    }

    render(){
        return(
            <div className="loginContainer">
                <div className="loginContent">
                    <div className="loginForm">
                        <h3>Login</h3>
                        <input 
                            type='text' 
                            placeholder="Username" 
                            value={this.state.username ? this.state.username:"" }
                            onChange={(e) => this.setInput("username", e.target.value)}
                        />
                        <input 
                            type='password' 
                            placeholder="Password" 
                            value={this.state.password ? this.state.password:"" }
                            onChange={(e) => this.setInput("password", e.target.value)}
                        />
                        <button 
                            disabled={this.state.buttonDisabled}
                            onClick={()=>this.doLogin()}
                        >
                            Submit
                        </button>
                    </div>

                    <Link to="/register">
                        <button className="registerButton">Create an account</button>
                    </Link>
                </div>
            </div>
            
        )        
    }
}

export default LoginScreen