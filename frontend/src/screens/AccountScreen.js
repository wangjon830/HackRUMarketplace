import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import Modal from 'react-modal';
import {observer} from "mobx-react";
import {Link} from 'react-router-dom';

class AccountScreen extends React.Component{
    constructor(){
      super();
      this.state={
        modalOpen: false,
        user: JSON.parse(window.localStorage.getItem('user')),
        updatedUser: JSON.parse(window.localStorage.getItem('user')) // need state variable to handle input changes in modal
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

    updateValue(property, val){
        this.setState(prevState=>{
            var updatedUser = prevState.updatedUser;
            updatedUser[property] = val;
            return {updatedUser};
        })
    }

    async submitChanges(){
        console.log(JSON.stringify(this.state.updatedUser));
      try{
        let res = await fetch('http://127.0.0.1:5000/editUser', {
            method: 'post',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.updatedUser)
        })

        let result = await res.json();
        if(result && result.success){
            alert("Account updated");
            this.setState(prevState=>({user: prevState.updatedUser}), ()=>{
                window.localStorage.setItem('user', JSON.stringify(this.state.user));
            })

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
                          id="emailInput"
                          type='text' 
                          placeholder="Email" 
                          value={this.state.updatedUser.email}
                          onChange={(e) => this.updateValue("email", e.target.value)}
                      />
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
                      <p id="username">{this.state.user.firstName + " " + this.state.user.lastName}</p>
                      <br/>
                  </div>
                  <button id="settingsEditButton" onClick={()=>this.setState(prevState=>({updatedUser: prevState.user, modalOpen: true}))}>
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

export default observer(AccountScreen);