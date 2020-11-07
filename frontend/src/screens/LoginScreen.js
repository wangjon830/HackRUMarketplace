import React from 'react';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import UserStore from '../stores/UserStore'

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
            console.log(result);
            if(result && result.success){
                UserStore.isLoggedIn = true;
                UserStore.email = result.email;
                this.reset();
            }
            else if(result && !result.success){
                this.badLogin(result.msg);
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
                        <form>
                            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding: "0 2rem"}}>
                                <input 
                                    id="firstNameInput"
                                    type='text' 
                                    placeholder="First name" 
                                    // value={this.state.email ? this.state.email:"" }
                                    // onChange={(e) => this.setInput("email", e.target.value)}
                                />
                                <input 
                                    id="lastNameInput"
                                    type='text' 
                                    placeholder="Last name" 
                                    // value={this.state.email ? this.state.email:"" }
                                    // onChange={(e) => this.setInput("email", e.target.value)}
                                />
                            </div>
                            <input 
                                id="emailInput"
                                type='text' 
                                placeholder="Email" 
                                // value={this.state.email ? this.state.email:"" }
                                // onChange={(e) => this.setInput("email", e.target.value)}
                            />
                            <input 
                                id="passwordInput"
                                type='password' 
                                placeholder="Password" 
                                // value={this.state.email ? this.state.email:"" }
                                // onChange={(e) => this.setInput("email", e.target.value)}
                            />
                            <input 
                                id="confirmPasswordInput"
                                type='password' 
                                placeholder="Confirm password" 
                                // value={this.state.email ? this.state.email:"" }
                                // onChange={(e) => this.setInput("email", e.target.value)}
                            />

                            <button 
                                id='registerButton'
                                disabled={this.state.buttonDisabled}
                                onClick={()=>this.doRegister()}
                            >
                                Register
                            </button>    
                        </form>                    
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