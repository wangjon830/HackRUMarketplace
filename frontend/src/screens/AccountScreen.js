import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import Modal from 'react-modal';
import {observer} from "mobx-react";
import {Link} from 'react-router-dom';
import UserStore from '../stores/UserStore';

class AccountScreen extends React.Component{
    constructor(){
      super();
      this.state={
        modalOpen: false,
        firstName: UserStore.firstName,
        lastName: UserStore.lastName,
        email: UserStore.email,
        location: '',
        phone: '',
        facebook: '',
        instagram: '',
        snapchat: ''
      }
    }

    async componentDidMount(){
        // try{
        //   let res = await fetch('http://127.0.0.1:5000/getAccount', {
        //       method: 'get',
        //       headers:{
        //           'Accept': 'application/json',
        //           'Content-Type': 'application/json'
        //       },
        //       body: JSON.stringify({
        //           email: UserStore.email
        //       })
        //   })

        //   let result = await res.json();

        //   if(result && result.success){
        //       this.setState({
        //         firstName: result.firstName,
        //         lastName: result.lastName,
        //         email: result.email,
        //         location: result.location,
        //         phone: result.phone,
        //         facebook: result.facebook,
        //         instagram: result.instagram,
        //         snapchat: result.snapchat
        //       });
        //   }
        //   else{
        //       console.log("Could not get account info")
        //       return;
        //   }
        // }
        // catch(e){
        //     console.log(e);
        //     return;
        // }
    };

    setInput(property, val){
      // if(val.length > 20){
      //     return;
      // }
      this.setState({
          [property]:val
      })
    }

    async submitChanges(){
      try{
        let res = await fetch('http://127.0.0.1:5000/editUser', {
            method: 'post',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              email: this.state.email,
              location: this.state.location,
              phone: this.state.phone,
              facebook: this.state.facebook,
              instagram: this.state.instagram,
              snapchat: this.state.snapchat
            })
        })

        let result = await res.json();
        if(result && result.success){
            alert("Account updated");
        }
        else {
            console.log("Could not update account")
        }
      }
      catch(e){
          console.log(e);
          // this.reset();
      }
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
                          value={this.state.instagram}
                          onChange={(e) => this.setInput("instagram", e.target.value)}
                      />
                      <input 
                          id="snapchatInput"
                          type='type' 
                          placeholder="Snapchat username" 
                          value={this.state.snapchat}
                          onChange={(e) => this.setInput("snapchat", e.target.value)}
                      />
                    </div>

                    <button 
                        id='submitButton'
                        onClick={()=>this.submitChanges()}
                    >
                        Submit
                    </button>  
                    <div id="settingsErrorMessage">{this.state.settingsErrorMessage}</div>
                </div>
            </Modal>
            <div id="AccountOptions" className = "sidenav">
                <Link to="/settings/account"><div className="navItem"><settingActive/>&nbsp;&nbsp;Personal&nbsp;Information</div></Link>
                <Link to="/settings/security"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Login&nbsp;&&nbsp;Security</div></Link>
                <Link to="/settings/transaction"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Your&nbsp;Transactions</div></Link>
                <Link to="/settings/listings"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Your&nbsp;Listings</div></Link>
            </div>
            <div className = "settings">
                <div className = "headText"><h1>Personal&nbsp;Information<hr/></h1></div>
                <div style={{display: "flex"}}>
                  <div className="profilePictureContainer">
                      <h3>Profile&nbsp;Picture</h3>
                      <img className="profilePic" src="/images/profile.jpg" alt="Profile Picture"/>
                      <br/>
                  </div>
                  <div style={{marginLeft:"2rem"}}>
                      <h3>Displayed&nbsp;Name</h3>
                      <p id="username">{this.state.firstName + " " + this.state.lastName}</p>
                      <br/>
                  </div>
                  <button id="settingsEditButton" onClick={()=>this.setState({modalOpen: true})}>
                    <EditIcon style={{marginRight: "0.5rem"}}/>Edit&nbsp;info
                  </button>
                </div>
                
                <div className = "settingsItem" style={{marginTop: "1rem"}}>
                    <h3>Location</h3>
                    <div id="UserLocation">{this.state.location}</div>
                    <br/>
                </div>
                <div className = "settingsItem">
                    <h3>Phone Number</h3>
                    <div id="UserPhone">{this.state.phone}</div>
                    <br/>
                </div>
                    <h3>Social Links</h3>
                    <div className="socialLinks">
                      <div className="settingsItem">
                        <p>Facebook</p>
                      <div><a id="Facebook" href={this.state.facebook}>{this.state.facebook}</a></div>
                    </div>
                    <div className="socialLinks">
                    <div className="settingsItem">
                      <p>Instagram</p>
                      <div><a id="Instagram" href={this.state.instagram}>{this.state.instagram}</a></div>
                      </div>
                    </div>
                    <div className="socialLinks">
                    <div className="settingsItem">
                      <p>Snapchat Username</p>
                      <div><p>{this.state.snapchat}</p></div>
                      </div>
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