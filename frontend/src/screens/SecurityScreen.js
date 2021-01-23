import React from 'react';
import {observer} from "mobx-react";
import SettingsNavigation from "../components/SettingsNavigation";

import User from "../web/User";

import '../styles/Security.css';

class SecurityScreen extends React.Component{
  constructor(props){
    super(props);
    this.state={
      emailAccordionOpen: false,
      newEmail: "",
      emailMessage: "",
      canSubmitEmail: false,
      passwordAccordionOpen: false,
      passwordSet: false,
      newPassword: "",
      confirmPassword: "",
      passwordMessage: "",
      canSubmitPassword: false
    }
  }

  closeEmailAccordion(){
    var emailAccordion = document.getElementById("emailAccordion")
    this.setState({emailAccordionOpen: false});
    emailAccordion.style.maxHeight = 0;
    document.getElementById("emailMessageDisplay").style.display = "none";
  }

  toggleEmailAccordion(){
    var emailAccordion = document.getElementById("emailAccordion")
    if(this.state.emailAccordionOpen){
      this.closeEmailAccordion();
    }
    else{
      this.setState({emailAccordionOpen: true});
      emailAccordion.style.maxHeight = emailAccordion.scrollHeight + 'px';
      this.closePasswordAccordion();
    }
  }

  closePasswordAccordion(){
    var passwordAccordion = document.getElementById("passwordAccordion")
    this.setState({passwordAccordionOpen: false});
    passwordAccordion.style.maxHeight = 0;
    document.getElementById("passwordMessageDisplay").style.display = "none";
  }

  togglePasswordAccordion(){
    var passwordAccordion = document.getElementById("passwordAccordion")
    if(this.state.passwordAccordionOpen){
      this.closePasswordAccordion();
    }
    else{
      this.setState({passwordAccordionOpen: true});
      passwordAccordion.style.maxHeight = passwordAccordion.scrollHeight + 'px';
      this.closeEmailAccordion();
    }
  }

  checkEmail(){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.setState({canSubmitEmail: re.test(String(this.state.newEmail).toLowerCase())});
  }

  // check if new password matches confirm password
  checkPassword(){
    if(this.state.newPassword.length >= 8 && this.state.newPassword === this.state.confirmPassword){
      this.setState({canSubmitPassword: true});
    }
    else
      this.setState({canSubmitPassword: false});
  }

  async submitEmailChange(){
    if(!this.state.canSubmitEmail)
      return;
    
    var updatedUser = {
      email: this.state.newEmail
    }
    
    await User.editUser(updatedUser)
    .then(response => {
      if(response.success){
        this.setEmailMessage("Email updated", '#00c903');
        this.setState({canSubmitEmail: false, newEmail: ""});
      }
      else if(response.message === "Tokens invalid")
          this.props.history.push('/')
      else
          this.setEmailMessage(response.message, '#ff3d3d');
    })
  }

  async submitPasswordChange(){
    if(!this.state.canSubmitPassword)
      return;
    
    // if password is already set, check if current password is correct
    if(this.state.passwordSet)
    var passwordCorrect = await User.verifyPassword(this.state.currentPassword)
    .then(response=>{
      if(!response){
        this.setPasswordMessage("Password is incorrect", '#ff3d3d');
        return false;
      }
      return true;
    })
    if(!passwordCorrect)
      return;

    await User.changePassword(this.state.newPassword)
    .then(response => {
      if(response.success){
        this.setPasswordMessage("Account updated", '#00c903');
        this.setState({canSubmitPassword: false, currentPassword: "", newPassword: "", confirmPassword: ""});
      }
      else if(response.message === "Tokens invalid")
          this.props.history.push('/')
      else
          this.setPasswordMessage(response.message, '#ff3d3d');
    })
  }

  setEmailMessage(message, color){
      this.setState({emailMessage: message})
      document.getElementById("emailMessageDisplay").style.backgroundColor = color;
      document.getElementById("emailMessageDisplay").style.display = "inline-block";
      var emailAccordion = document.getElementById("emailAccordion")
      emailAccordion.style.maxHeight = emailAccordion.scrollHeight + 'px';
  }

  setPasswordMessage(message, color){
    this.setState({passwordMessage: message})
    document.getElementById("passwordMessageDisplay").style.backgroundColor = color;
    document.getElementById("passwordMessageDisplay").style.display = "inline-block";
    var passwordAccordion = document.getElementById("passwordAccordion")
    passwordAccordion.style.maxHeight = passwordAccordion.scrollHeight + 'px';
  }

  async componentDidMount(){
    var user = JSON.parse(window.localStorage.getItem('user'))
    try{
      // check if a password is set 
      await fetch('http://127.0.0.1:5000/checkPassword', {
          method: 'post',
          headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            _id: user._id
        })
      })
      .then(response => response.json())
      .then(data => {
        if(data && data.success){
          this.setState({passwordSet: data.is_set});
        }
        else{
            console.log(data.msg)
            return;
        }
      })        
    }
    catch(e){
        console.log(e);
        return;
    }
  }

  render(){
    var user = JSON.parse(window.localStorage.getItem('user'))
    return( 
      <div id="securityScreen"  className="settingsScreen">
          <SettingsNavigation pathname={this.props.location.pathname}/>
          <div className="pageContent">
              <div className="settingsHeader">
                <h1>Login&nbsp;&amp;&nbsp;Security&nbsp;Settings</h1>
                <hr/>
              </div>

              <div className="settingsItem">
                <div className="settingsItemHeader">
                  <h3>Email</h3>
                  <p id="email">{user.email}</p>
                </div>
                <div style={{display:'flex', justifyContent:'flex-end', width: '100%', marginTop: '1rem'}}>
                  <button className="editButton" onClick={()=>this.toggleEmailAccordion()}>{this.state.emailAccordionOpen ? "Close" : "Edit"}</button>
                </div>
                  
                <div id="emailAccordion" className="accordion">
                  <div className="accordionContent">
                    <input className="accountInput" 
                            type="email" 
                            id="changeEmail" 
                            name="changeEmail" 
                            placeholder="New email" 
                            value={this.state.newEmail} 
                            onChange={(e)=>{
                              this.setState({newEmail: e.target.value});
                              this.checkEmail();
                            }}
                    />
                    <button className="submitButton" 
                            style={{backgroundColor: this.state.canSubmitEmail ? '#33ccff' : 'grey'}} 
                            onClick={()=>this.submitEmailChange()}
                    >
                      Change Email
                    </button>
                  </div>
                  <div id="emailMessageDisplay" className="messageDisplay">{this.state.emailMessage}</div>
                </div>
                <hr/>
              </div>


              <div className="settingsItem">
                <div className="settingsItemHeader">
                  <h3>Password</h3>
                  <button className="editButton" onClick={()=>this.togglePasswordAccordion()}>
                    {this.state.passwordAccordionOpen ? "Close" : this.state.passwordSet ? "Change password" : "Set password"}
                    </button>
                </div>
  
                <div id="passwordAccordion" className="accordion">
                  <div className="accordionContent">
                    {this.state.passwordSet && 
                    <input className="accountInput" 
                            autoComplete="new-password"
                            type="password" 
                            id="currentPassword" 
                            name="currentPassword" 
                            placeholder="Current"
                            value={this.state.currentPassword} 
                            onChange={(e) => {
                              this.setState({currentPassword: e.target.value});
                            }}
                    />
                    }
                    <input className="accountInput" 
                            autoComplete="new-password"
                            type="password" 
                            id="newPassword" 
                            name="newPassword" 
                            placeholder="New"
                            value={this.state.newPassword} 
                            onChange={(e) => {
                              this.setState({newPassword: e.target.value}, ()=>{
                                this.checkPassword();
                              });
                            }}
                    />
                    <input className="accountInput" 
                            autoComplete="new-password"
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            placeholder="Confirm"
                            value={this.state.confirmPassword} 
                            onChange={(e) => {
                              this.setState({confirmPassword: e.target.value}, ()=>{
                                this.checkPassword();
                              });
                            }}
                    />
                    <button className="submitButton" 
                            style={{backgroundColor: this.state.canSubmitPassword ? '#33ccff' : 'grey', 
                            marginBottom: '1rem'}}
                            onClick={()=>this.submitPasswordChange()}>
                        Change Password
                    </button>
                    <a href="">I forgot my password</a>
                  </div>
                  <div id="passwordMessageDisplay" className="messageDisplay">{this.state.passwordMessage}</div>
                </div>
              </div>
          </div>
      </div>
      )
  }
}

export default observer(SecurityScreen);
