import React from 'react';
import {Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import UserStore from '../stores/UserStore';
var bcrypt = require('bcryptjs');

class LoginScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            buttonDisabled: false,
            errorMessage: '',
            modalOpen: false,
            registerErrorMessage: '',
            loginSuccess: false
        }
        this.doRegister = this.doRegister.bind(this);
        this.reset = this.reset.bind(this);
        this.setModalError = this.setModalError.bind(this);
    }

    componentDidMount(){
        this.reset();
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

    reset(){
        document.getElementById("loginErrorMessage").style.display="none";
        this.setState({
            email: '',
            password: '',
            buttonDisabled: false,
            errorMessage: ''
        })
    }

    badLogin(err){
        document.getElementById("loginErrorMessage").style.display="block";
        this.setState({
            errorMessage: err,
            password: '',
            buttonDisabled: false
        })
    }

    setModalError(errMessage){
        document.getElementById("registerErrorMessage").style.display="block";
        this.setState({
            registerErrorMessage: errMessage
        })
    }

    async doLogin(){
        if(!this.state.email){
            return;
        }
        if(!this.state.password){
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try{
            let res = await fetch('http://127.0.0.1:5000/login', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            })

            let result = await res.json();
            if(result && result.success){
                // values must be saved as string in LocalStorage
                this.saveAccountInfo(JSON.stringify(result.user));
            }
            else if(result && !result.success){
                this.badLogin(result.msg);
            }
            else{
                this.badLogin("Could not login")
            }
        }
        catch(e){
            console.log(e);
            // this.reset();
        }
    }

    async doRegister(){
        let firstName=document.getElementById("firstNameInput").value;
        let lastName=document.getElementById("lastNameInput").value;
        let email=document.getElementById("emailInput").value;
        let password=document.getElementById("passwordInput").value;
        let confirmPassword=document.getElementById("confirmPasswordInput").value;

        if(!firstName || !lastName || !email || !password || !confirmPassword){
            this.setModalError("Please fill in all fields");
            return;
        }
        if(confirmPassword !== password){
            this.setModalError("Passwords do not match");
            return;
        }

        let hashedPassword = await bcrypt.hash(password, 10)

        try{
            let res = await fetch('http://127.0.0.1:5000/register', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    hashedPassword
                })
            })

            let result = await res.json();

            if(result && result.success){
                this.saveAccountInfo(result);
            }
            else if(result && !result.success){
                this.setModalError("An account already exists for this email");
                return;
            }
            else{
                this.setModalError("Account could not be created");
                return;
            }
        }
        catch(e){
            console.log(e);
            this.reset();
            return;
        }
    }

    saveAccountInfo(accountJson){
        window.localStorage.setItem('user', accountJson);
        this.setState({loginSuccess:true})
    }

    render(){        
        return(
            <div className="loginContainer">
                {this.state.loginSuccess ? <Redirect to='/'/> : ""}
                <Modal
                    isOpen={this.state.modalOpen}
                    closeTimeoutMS={500}
                    onRequestClose={() => this.setState({modalOpen:false})}
                    style={{
                        overlay: {
                        backgroundColor: "rgba(0, 0, 15, 0.5)",
                        },
                        content: {
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            padding: 0,
                            paddingBottom: "1rem",
                            borderRadius: "10px",
                            width: "500px",
                            height: "550px",
                            display: "flex",
                            flexDirection: "column",
                            zIndex: "0"
                        },
                    }}
                    >
                    <div className="modalHeader">
                        <button
                        className="modalCloseBtn"
                        onClick={() => this.setState({modalOpen:false})}
                        >
                            &times;
                        </button>

                        <h1>Sign Up</h1>
                    </div>

                    <div className="modalBody">
                        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding: "0 2rem"}}>
                            <input 
                                id="firstNameInput"
                                type='text' 
                                placeholder="First name" 
                            />
                            <input 
                                id="lastNameInput"
                                type='text' 
                                placeholder="Last name" 
                            />
                        </div>
                        <input 
                            id="emailInput"
                            type='text' 
                            placeholder="Email" 
                        />
                        <input 
                            id="passwordInput"
                            type='password' 
                            placeholder="Password" 
                        />
                        <input 
                            id="confirmPasswordInput"
                            type='password' 
                            placeholder="Confirm password" 

                        />

                        <button 
                            id='registerButton'
                            disabled={this.state.buttonDisabled}
                            onClick={this.doRegister}
                        >
                            Register
                        </button>  
                        <div className="errorMessage" id="registerErrorMessage">{this.state.registerErrorMessage}</div>
                    </div>
                </Modal>

                <div className="loginContent">
                    <div className="loginForm">
                        <h1 style={{marginBottom: "2.5rem"}}>Login</h1>
                        <input 
                            type='text' 
                            placeholder="Email" 
                            value={this.state.email ? this.state.email:"" }
                            onChange={(e) => this.setInput("email", e.target.value)}
                        />
                        <input 
                            type='password' 
                            placeholder="Password" 
                            value={this.state.password ? this.state.password:"" }
                            onChange={(e) => this.setInput("password", e.target.value)}
                        />
                        <button 
                            id='loginButton'
                            disabled={this.state.buttonDisabled}
                            onClick={()=>this.doLogin()}
                        >
                            Continue
                        </button>
                    </div>

                    <p style={{marginTop: "1rem"}}>New user?</p>
                    <button id="registerModalButton" onClick={()=>this.setState({modalOpen: true})}>Create an account</button>
                    <div className="errorMessage" id="loginErrorMessage">{this.state.errorMessage}</div>
                </div>
            </div>
            
        )        
    }
}

export default LoginScreen