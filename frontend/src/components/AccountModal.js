import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import Modal from 'react-modal';
import CameraAltIcon from '@material-ui/icons/CameraAlt';

import User from '../web/User';

import '../styles/AccountModal.css';

class AccountModal extends React.Component{
    constructor(){
      super();
      this.state={
        modalOpen: false,
        updatedUser: null,
        displayMessage: ""
      }
    }

    async componentDidMount(){
        var user = JSON.parse(window.localStorage.getItem('user'))
        if(!user)
            this.props.history.push('/')

        Modal.setAppElement('body');
    };

    toBase64(file){
        if(!file)
            return;
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                this.setState(prevState=>{
                    var updatedUser = JSON.parse(JSON.stringify(prevState.updatedUser));
                    updatedUser.profilePic = e.target.result;
                    return {updatedUser}
                })
                resolve(reader.result);
            }
            reader.onerror = error => reject(error);
        });
    }

    resetModal(){
        var user = this.props.getUser();
        this.setState({
            updatedUser: user,
            displayMessage: ""
        });
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
                this.props.updateUser(this.state.updatedUser);
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
        <div>
            <button id="settingsEditButton" onClick={()=>{
                      this.resetModal();
                      this.setState({modalOpen: true})
                  }}>
                    <EditIcon style={{marginRight: "0.5rem"}}/>Edit&nbsp;info
            </button>
            <Modal
                isOpen={this.state.modalOpen}
                closeTimeoutMS={500}
                onRequestClose={() => this.setState({modalOpen:false})}
                id="accountModal"
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
                    <div className="profilePic">
                        <img src={this.state.updatedUser && this.state.updatedUser.profilePic ? this.state.updatedUser.profilePic : "/images/profile.jpg"} 
                            alt="Profile"
                        />      
                        <div className="imageOverlay" onClick={()=>document.getElementById("imageInput").click()}>
                            <CameraAltIcon style={{marginRight:"0.5rem", fontSize: "2rem"}}/>Change image
                            <input type="file" 
                                id="imageInput" 
                                accept="image/*"
                                style={{display:"none"}} 
                                onChange={(e)=>this.toBase64(e.target.files[0])}
                            />
                        </div>
                    </div>
                    
                    <div className="modalSection">
                        <h3>Bio</h3>
                        <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                            <textarea 
                                className="inputContainer"
                                placeholder="Bio" 
                                name='bio' 
                                rows={5}
                                style={{outline:"none", font: "400 1rem Arial", padding: "7px", width:"100%", resize:'none'}}
                                value={this.state.updatedUser ? this.state.updatedUser.bio : ""}
                                onChange={(e) => this.updateValue("bio", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modalSection">
                        <h3>Name</h3>
                        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                            <input 
                                id="firstNameInput"
                                type='text' 
                                placeholder="First name" 
                                style={{width:"45%"}}
                                value={this.state.updatedUser ? this.state.updatedUser.firstName : ""}
                                onChange={(e) => this.updateValue("firstName", e.target.value)}
                            />
                            <input 
                                id="lastNameInput"
                                type='text' 
                                placeholder="Last name" 
                                style={{width:"45%"}}
                                value={this.state.updatedUser ? this.state.updatedUser.lastName : ""}
                                onChange={(e) => this.updateValue("lastName", e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="modalSection" style={{display:"flex", justifyContent:"space-between"}}>
                        <div style={{width:"45%"}}>
                            <h3>Phone</h3>
                            <input 
                                id="phoneInput"
                                type='tel' 
                                placeholder="Phone number" 
                                style={{width:"100%"}}
                                value={this.state.updatedUser ? this.state.updatedUser.phone : ""}
                                onChange={(e) => this.updateValue("phone", e.target.value)}
                            />
                        </div>
                        
                        <div style={{width:"45%"}}>
                            <h3>Location</h3>
                            <input 
                                id="locationInput"
                                type='text' 
                                placeholder="Location" 
                                style={{width:"100%"}}
                                value={this.state.updatedUser ? this.state.updatedUser.location : ""}
                                onChange={(e) => this.updateValue("location", e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="modalSection">
                        <h3>Facebook</h3>
                        <input 
                            id="facebookInput"
                            type='text' 
                            placeholder="Facebook URL" 
                            style={{width:"100%"}}
                            value={this.state.updatedUser ? this.state.updatedUser.facebook : ""}
                            onChange={(e) => this.updateValue("facebook", e.target.value)}
                        />
                    </div>

                    <div className="modalSection">
                        <h3>Instagram</h3>
                        <input 
                            id="instagramInput"
                            type='text' 
                            placeholder="Instagram handle" 
                            style={{width:"100%"}}
                            value={this.state.updatedUser ? this.state.updatedUser.instagram : ""}
                            onChange={(e) => this.updateValue("instagram", e.target.value)}
                        />
                    </div>

                    <div className="modalSection">
                        <h3>Snapchat</h3>
                        <input 
                            id="snapchatInput"
                            type='text' 
                            placeholder="Snapchat username" 
                            style={{width:"100%"}}
                            value={this.state.updatedUser ? this.state.updatedUser.snapchat : ""}
                            onChange={(e) => this.updateValue("snapchat", e.target.value)}
                        />
                    </div>

                    <button 
                        className='submitBtn'
                        onClick={()=>this.submitChanges()}
                    >
                        Submit
                    </button>  
                    <div id="settingsMessageDisplay">{this.state.displayMessage}</div>
                </div>
            </Modal>
        </div>
        )
    }
}

export default AccountModal;