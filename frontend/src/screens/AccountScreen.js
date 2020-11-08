import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import Modal from 'react-modal';
import {observer} from "mobx-react";
import UserStore from '../stores/UserStore';

import AccountSidebar from "../components/AccountSidebar";

class AccountScreen extends React.Component{
    constructor(){
      super();
      this.state={
        modalOpen: false,
        firstName: '',
        lastName: '',
        email: '',
        location: '',
        phone: '',
      }
    }

    async componentDidMount(){
        try{
          let res = await fetch('http://127.0.0.1:5000/getAccount', {
              method: 'post',
              headers:{
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  email: UserStore.email
              })
          })

          let result = await res.json();

          if(result && result.success){
              this.setState({
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                location: result.location,
                phone: result.phone,
                facebook: result.facebook,
                instagram: result.instagram,
                snapchat: result.snapchat
              });
          }
          else{
              console.log("Could not get account info")
              return;
          }
        }
        catch(e){
            console.log(e);
            return;
        }
    };

    setInput(property, val){
      val = val.trim();
      // if(val.length > 20){
      //     return;
      // }
      this.setState({
          [property]:val
      })
    }

    render(){
      return( 
        <div>
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
                    <img className="profilePic" style={{marginBottom:"1rem"}} src="/images/profile.jpg" alt="Profile Picture"/>
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding: "0 2rem"}}>
                        <input 
                            id="firstNameInput"
                            type='text' 
                            placeholder="First name" 
                            value={this.state.firstName}
                            onChange={(e) => this.setInput("firstName", e.target.value)}
                        />
                        <input 
                            id="lastNameInput"
                            type='text' 
                            placeholder="Last name" 
                            value={this.state.lastName}
                            onChange={(e) => this.setInput("lastName", e.target.value)}
                        />
                    </div>
                    <div style={{display:"flex"}}>
                      <input 
                          id="emailInput"
                          type='text' 
                          placeholder="Email" 
                          value={this.state.email}
                          onChange={(e) => this.setInput("email", e.target.value)}
                      />
                      <input 
                          id="phoneInput"
                          type='tel' 
                          placeholder="Phone number" 
                          value={this.state.phone}
                          onChange={(e) => this.setInput("phone", e.target.value)}
                      />
                      <input 
                          id="locationInput"
                          type='text' 
                          placeholder="Location" 
                          value={this.state.location}
                          onChange={(e) => this.setInput("location", e.target.value)}
                      />
                    </div>
                    
                    <div style={{display:"flex"}}>
                      <input 
                          id="facebookInput"
                          type='type' 
                          placeholder="Facebook URL" 
                          value={this.state.facebook}
                          onChange={(e) => this.setInput("facebook", e.target.value)}
                      />
                      <input 
                          id="instagramInput"
                          type='type' 
                          placeholder="Instagram handle" 
                          value={this.state.facebook}
                          onChange={(e) => this.setInput("instagram", e.target.value)}
                      />
                      <input 
                          id="snapchatInput"
                          type='type' 
                          placeholder="Snapchat username" 
                          value={this.state.facebook}
                          onChange={(e) => this.setInput("snapchat", e.target.value)}
                      />
                    </div>

                    <button 
                        id='submitButton'
                        onClick={this.submitChanges}
                    >
                        Submit
                    </button>  
                    <div id="settingsErrorMessage">{this.state.settingsErrorMessage}</div>
                </div>
            </Modal>
            <AccountSidebar/>
            <div className = "settings">
                <div className = "headText"><h1>Personal Information<hr/></h1></div>
                <div style={{display: "flex"}}>
                  <div className="settingsItem">
                      <h3>Profile Picture</h3>
                      <img className="profilePic" src="/images/profile.jpg" alt="Profile Picture"/>
                      <br/>
                  </div>
                  <div className = "settingsItem" style={{marginLeft:"2rem"}}>
                      <h3>Displayed Name</h3>
                      <p id="username">{UserStore.firstName + " " + UserStore.lastName}</p>
                      <br/>
                  </div>
                  <button id="settingsEditButton" onClick={()=>this.setState({modalOpen: true})}>
                    <EditIcon style={{marginRight: "0.5rem"}}/>Edit info
                  </button>
                </div>
                
                <div className = "settingsItem">
                    <h3>Location</h3>
                    <p id="UserLocation">Busch Campus</p>
                    <br/>
                </div>
                <div className = "settingsItem">
                    <h3>Phone Number</h3>
                    <p id="UserPhone">732-123-4567</p>
                    <br/>
                </div>
                <div className = "settingsItem">
                    <h3>Social Links</h3>
                    <div className="socialLinks">
                        <p><a id="Facebook" href="http://www.facebook.com">Facebook</a></p>
                        <p><a id="Instagram" href="http://www.instagram.com">Instagram</a></p>
                        <p>Snapchat Username</p>
                    </div>
                    <br/>
                </div>
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

export default observer(AccountScreen);