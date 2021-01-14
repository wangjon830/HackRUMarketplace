import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import Modal from 'react-modal';

import User from '../web/User';
import SettingsNavigation from '../components/SettingsNavigation';

import '../styles/Account.css';

var tempUser = {
    firstName: "",
    lastName: "", 
    imageUrl: "",
    profilePic: "",
    email: "",
    phone: "",
    facebook: "",
    instagram: "",
    snapchat: ""
}

class AccountScreen extends React.Component{
    constructor(){
      super();
      this.state={
        modalOpen: false,
        user: JSON.parse(JSON.stringify(tempUser)),
        updatedUser: JSON.parse(JSON.stringify(tempUser)), // need state variable to handle input changes in modal
        displayMessage: ""
      }
    }

    async componentDidMount(){
        var user = JSON.parse(window.localStorage.getItem('user'))
        if(!user)
            this.props.history.push('/')

        Modal.setAppElement('body');

        try{
            await fetch('http://127.0.0.1:5000/getAccount', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id: user._id
                })
            })
            .then(response=>response.json())
            .then(data => {
                if(data && data.success){
                    this.setState({user: data.user});
                }
                else{
                    console.log("Could not get account info")
                    return;
                }
            })
        }
        catch(e){
            console.log(e);
            return;
        }
    };

    resetModal(){
        this.setState(prevState=>({
            updatedUser: JSON.parse(JSON.stringify(prevState.user)),
            displayMessage: ""
        }));
        // document.getElementById("settingsErrorMessage").style.display="none";
    }

    updateValue(property, val){
        this.setState(prevState=>{
            var updatedUser = prevState.updatedUser;
            updatedUser[property] = val;
            return {updatedUser};
        })
    }

    async submitChanges(){
        await User.editUser(this.state.updatedUser)
        .then(response=>{
            if(response.success){
                this.setMessage("Account updated", '#00c903');
                this.setState(prevState=>({user: prevState.updatedUser}))
            }
            else if(response.message === "Tokens invalid")
                this.props.history.push('/')
            else
                this.setMessage(response.message, '#ff3d3d');
        })
    }

    setMessage(message, color){
        this.setState({displayMessage: message})
        document.getElementById("settingsMessageDisplay").style.backgroundColor = color;
        document.getElementById("settingsMessageDisplay").style.display = "block";
    }

    render(){
      return( 
        <div id="accountScreen">
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
                    width: "650px",
                    height: "700px",
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

                    <h1>Edit account info</h1>
                </div>

                <div className="modalBody" id="settingsModalBody">
                    <img className="profilePic" 
                        style={{marginBottom:"1rem"}} 
                        src={this.state.user.imageUrl ? this.state.user.imageUrl : "/images/profile.jpg"} 
                        alt="Profile"
                    />
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding: "0 2rem"}}>
                        <input 
                            id="firstNameInput"
                            type='text' 
                            placeholder="First name" 
                            value={this.state.updatedUser.firstName}
                            onChange={(e) => this.updateValue("firstName", e.target.value)}
                        />
                        <input 
                            id="lastNameInput"
                            type='text' 
                            placeholder="Last name" 
                            value={this.state.updatedUser.lastName}
                            onChange={(e) => this.updateValue("lastName", e.target.value)}
                        />
                    </div>
                    <div style={{display:"flex"}}>
                      <input 
                          id="phoneInput"
                          type='tel' 
                          placeholder="Phone number" 
                          value={this.state.updatedUser.phone}
                          onChange={(e) => this.updateValue("phone", e.target.value)}
                      />
                      <input 
                          id="locationInput"
                          type='text' 
                          placeholder="Location" 
                          value={this.state.updatedUser.location}
                          onChange={(e) => this.updateValue("location", e.target.value)}
                      />
                    </div>
                    
                    <div style={{display:"flex"}}>
                      <input 
                          id="facebookInput"
                          type='text' 
                          placeholder="Facebook URL" 
                          value={this.state.updatedUser.facebook}
                          onChange={(e) => this.updateValue("facebook", e.target.value)}
                      />
                      <input 
                          id="instagramInput"
                          type='text' 
                          placeholder="Instagram handle" 
                          value={this.state.updatedUser.instagram}
                          onChange={(e) => this.updateValue("instagram", e.target.value)}
                      />
                      <input 
                          id="snapchatInput"
                          type='text' 
                          placeholder="Snapchat username" 
                          value={this.state.updatedUser.snapchat}
                          onChange={(e) => this.updateValue("snapchat", e.target.value)}
                      />
                    </div>

                    <button 
                        id='submitButton'
                        onClick={()=>this.submitChanges()}
                    >
                        Submit
                    </button>  
                    <div id="settingsMessageDisplay">{this.state.displayMessage}</div>
                </div>
            </Modal>
            <SettingsNavigation pathname={this.props.location.pathname}/>
            <div className = "settings">
                <div className = "headText"><h1>Personal&nbsp;Information<hr/></h1></div>
                <div style={{display: "flex"}}>
                  <div className="profilePictureContainer">
                      <h3>Profile&nbsp;Picture</h3>
                      <img className="profilePic" 
                            src={this.state.user.imageUrl ? this.state.user.imageUrl : "/images/profile.jpg"} 
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
                  <button id="settingsEditButton" onClick={()=>{
                      this.resetModal();
                      this.setState({modalOpen: true})
                  }}>
                    <EditIcon style={{marginRight: "0.5rem"}}/>Edit&nbsp;info
                  </button>
                </div>
                
                <div className = "settingsItem" style={{marginTop: "1rem"}}>
                    <h3>Location</h3>
                    <div id="UserLocation">{this.state.user.location}</div>
                    <br/>
                </div>
                <div className = "settingsItem">
                    <h3>Phone Number</h3>
                    <div id="UserPhone">{this.state.user.phone}</div>
                    <br/>
                </div>
                <h3>Social Links</h3>
                <div className="socialLinks">
                    <div className="settingsItem">
                        <i className="fab fa-facebook brand-icon" style={{color:"#4267B2"}}/>
                        <div>
                            <a id="Facebook" href={this.state.user.facebook}>{this.state.user.facebook}</a>
                        </div>
                    </div>
                </div>
                <div className="socialLinks">
                    <div className="settingsItem">
                        <i className="fab fa-instagram brand-icon" id="instagram"/>
                        <div>
                            <a id="Instagram" href={this.state.user.instagram}>{this.state.user.instagram}</a>
                        </div>
                    </div>
                </div>
                <div className="socialLinks">
                    <div className="settingsItem">
                        <i className="fab fa-snapchat-square brand-icon" id="snapchat"/>
                        <div>
                            <p>{this.state.user.snapchat}</p>
                        </div>
                    </div>
                </div>
                <br/>
                {/* <div className = "settingsItem">
                    <h3>Bio</h3>
                    <p id="UserBio">Hello friend</p>
                    <br/>
                </div> */}
            </div>
        </div>
        )
    }
}

export default AccountScreen;