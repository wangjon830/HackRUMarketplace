import React from 'react';

import User from '../web/User';
import SettingsNavigation from '../components/SettingsNavigation';
import AccountModal from '../components/AccountModal';

import '../styles/Account.css';

var tempUser = {
    firstName: "",
    lastName: "", 
    profilePic: "",
    bio:"",
    email: "",
    phone: "",
    facebook: "",
    instagram: "",
    snapchat: ""
}

class EditAccountScreen extends React.Component{
    constructor(){
      super();
      this.state={
        user: JSON.parse(JSON.stringify(tempUser)),
      }
    }

    async componentDidMount(){
        var user = JSON.parse(window.localStorage.getItem('user'))
        if(!user)
            this.props.history.push('/')

        await User.getAccount(user._id)
        .then(response=>this.setState({user: response.user}))
    };

    getUser(){
        return JSON.parse(JSON.stringify(this.state.user));
    }

    updateUser(updatedUser){
        this.setState({user: updatedUser})
    }

    render(){
      return( 
        <div id="editAccountScreen" className="settingsScreen">
            <SettingsNavigation pathname={this.props.location.pathname}/>
            <div className="accountContent">
                <div className = "settingsHeader"><h1>Personal&nbsp;Information<hr/></h1></div>
                <div style={{display: "flex"}}>
                  <div className="profilePictureContainer">
                      <h3>Profile&nbsp;Picture</h3>
                      <img className="profilePic" 
                            src={this.state.user.profilePic ? this.state.user.profilePic : "/images/profile.jpg"} 
                            alt="Profile"/>
                      <br/>
                  </div>
                  <div style={{marginLeft:"2rem"}}>
                      <h3>Displayed&nbsp;Name</h3>
                      <p id="username">{this.state.user.firstName + " " + this.state.user.lastName}</p>
                      <br/>
                      <h3>Email</h3>
                      <p id="email">{this.state.user.email}</p>
                      <br/>
                  </div>
                  <AccountModal getUser={()=>this.getUser()} updateUser={updatedUser=>this.updateUser(updatedUser)}/>
                </div>
                
                <div className="accountItem" style={{marginTop: "1rem", alignItems: 'flex-start'}}>
                    <h3 style={{marginTop:"0.5rem"}}>Bio</h3>
                    <div style={{minHeight:"5rem", alignItems:"flex-start", paddingTop:"0.5rem"}}>{this.state.user.bio}</div>
                </div>
                <div className = "accountItem">
                    <h3>Location</h3>
                    <div>{this.state.user.location}</div>
                    <br/>
                </div>
                <div className = "accountItem">
                    <h3>Phone Number</h3>
                    <div>{this.state.user.phone}</div>
                    <br/>
                </div>
                <h3>Social Links</h3>
                <div className="socialLinks">
                    <div className="accountItem">
                        <i className="fab fa-facebook brand-icon" style={{color:"#4267B2"}}/>
                        <div>
                            <a id="Facebook" href={this.state.user.facebook}>{this.state.user.facebook}</a>
                        </div>
                    </div>
                </div>
                <div className="socialLinks">
                    <div className="accountItem">
                        <i className="fab fa-instagram brand-icon" id="instagram"/>
                        <div>
                            <a id="Instagram" href={this.state.user.instagram}>{this.state.user.instagram}</a>
                        </div>
                    </div>
                </div>
                <div className="socialLinks">
                    <div className="accountItem">
                        <i className="fab fa-snapchat-square brand-icon" id="snapchat"/>
                        <div>
                            <p>{this.state.user.snapchat}</p>
                        </div>
                    </div>
                </div>
                <br/>
            </div>
        </div>
        )
    }
}

export default EditAccountScreen;