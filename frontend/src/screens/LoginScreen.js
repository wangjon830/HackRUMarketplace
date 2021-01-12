import React from 'react';
import {Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login';

import Login from '../web/Login';

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
        // redirect to homepage if already logged in
        var user = JSON.parse(localStorage.getItem("user"));
        if(user)
            this.props.history.push('/')

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

        await Login.login(this.state.email, this.state.password)
        .then(response=>{
            if(!response.success)
                this.badLogin(response.message)
            else
                this.setState({loginSuccess:true})
        })
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

        var account = {firstName, lastName, email, password}
        await Login.register(account)
        .then(response=>{
            if(!response.success)
                this.setModalError(response.message);
            else
                this.setState({loginSuccess:true})
        })
    }

    responseFacebook(response){
        var name = response.name.split(" ");
        var user = {
            firstName: name[0],
            lastName: name[name.length - 1],
            email: response.email,
            imageUrl: response.picture.data.url,
            facebookId: response.id
        }
        this.authenticateUser(user)      
    }

    responseGoogle(response){
        var user = {
            firstName: response.profileObj.givenName,
            lastName: response.profileObj.familyName,
            email: response.profileObj.email,
            imageUrl: response.profileObj.imageUrl,
            googleId: response.profileObj.googleId
        }
        this.authenticateUser(user)      
    }

    async authenticateUser(user){
        await Login.authenticateUser(user)
        .then(response=>{
            if(!response.success)
                this.badLogin(response.message)
            else
                this.setState({loginSuccess:true})
        })
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

                    <div className="oauthSection">
                        <FacebookLogin
                            appId="2895624537377016"
                            fields="name,email,picture"
                            callback={(res)=>this.responseFacebook(res)} 
                            cssClass="btnFacebook"
                            icon={<i className="fa fa-facebook" style={{marginRight:'1rem'}}></i>}
                        />
                        <GoogleLogin
                            clientId="260001781758-o133qkucia4e05p2nrru5mb95fo1ubt3.apps.googleusercontent.com"
                            buttonText="Login with Google"
                            onSuccess={(res)=>this.responseGoogle(res)}
                            onFailure={(res)=>this.responseGoogle(res)}
                            cookiePolicy={'single_host_origin'}
                            className="btnGoogle"
                        />
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