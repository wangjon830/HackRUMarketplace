import React from 'react';
import {Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import UserStore from '../stores/UserStore';

class LoginScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            buttonDisabled: false,
            errorMessage: '',
            modalOpen: false,
            modalErrorMessage: '',
            loginSuccess: false
        }
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
        document.getElementById("errorMessage").style.display="none";
        this.setState({
            email: '',
            password: '',
            buttonDisabled: false,
            errorMessage: ''
        })
    }

    badLogin(err){
        document.getElementById("errorMessage").style.display="block";
        this.setState({
            errorMessage: err,
            password: '',
            buttonDisabled: false
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
                this.saveAccountInfo(result);
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
            this.reset();
        }
    }

    async doRegister(){
        let firstName=document.getElementById("firstNameInput").value;
        let lastName=document.getElementById("lastNameInput").value;
        let email=document.getElementById("emailInput").value;
        let password=document.getElementById("passwordInput").value;
        let confirmPassword=document.getElementById("confirmPasswordInput").value;

        if(confirmPassword !== password){
            this.setState({
                modalErrorMessage: "Passwords do not match"
            })
            return;
        }

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
                    password
                })
            })

            let result = await res.json();
            if(result && result.success){
                this.saveAccountInfo(result);
            }
            else if(result && !result.success){
                this.setState({
                    modalErrorMessage: "An account already exists for this email"
                })
                return;
            }
            else{
                this.setState({
                    modalErrorMessage: "Account could not be created"
                })
                return;
            }
        }
        catch(e){
            console.log(e);
            this.reset();
        }
    }

    saveAccountInfo(accountJson){
        UserStore.loggedIn = true;
        UserStore.firstName = accountJson.firstName;
        UserStore.lastName = accountJson.lastName;
        UserStore.email = accountJson.email;
        UserStore.profilePic = accountJson.profilePic;
        this.setState({loginSuccess:true})
        console.log(UserStore);
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
                    <div id="errorMessage">{this.state.errorMessage}</div>
                </div>
            </div>
            
        )        
    }
}

export default LoginScreen