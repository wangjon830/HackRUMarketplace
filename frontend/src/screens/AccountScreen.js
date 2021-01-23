import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';

import User from '../web/User';

import '../styles/Account.css';

class AccountScreen extends React.Component{
    constructor(){
      super();
      this.state={
        user: null,
        displayMessage: ""
      }
    }

    async componentDidMount(){
        var user = JSON.parse(window.localStorage.getItem('user'))
        if(!user)
            this.props.history.push('/')

        await User.getAccount(this.props.match.params.id)
        .then(response=>this.setState({user: response.user}))
    };

    setMessage(message, color){
        this.setState({displayMessage: message})
        document.getElementById("settingsMessageDisplay").style.backgroundColor = color;
        document.getElementById("settingsMessageDisplay").style.display = "block";
    }

    render(){
      return( 
        <div id="accountScreen">
            {this.state.user &&
            <div className="accountContent">
                <div className="accountHeader">
                  <div className="profileContainer">
                        <img className="profilePic" 
                            src={this.state.user.profilePic ? this.state.user.profilePic : "/images/profile.jpg"} 
                            alt="Profile"
                        />
                        <div>
                            <h1>{this.state.user.firstName + " " + this.state.user.lastName}</h1>
                            <p>{this.state.user.email}</p>
                        </div>
                  </div>
                </div>
                
                <div className="accountBody">
                    <div className="accountBio">
                        <h3 style={{marginBottom: "0.5rem"}}><PersonIcon style={{marginRight:"0.5rem"}}/> Bio:</h3>
                        {this.state.user.bio ? 
                            <p>{this.state.user.bio}</p>
                            :
                            <p className="placeholderText">No bio to show</p>
                        }
                    </div>

                    <div style={{display:"flex"}}>
                        <div>
                            <div className="accountItem">
                                <h3><LocationOnIcon style={{marginRight:"0.5rem"}}/> Location:</h3>
                                {this.state.user.location ? 
                                    <div>{this.state.user.location}</div>
                                    :
                                    <p className="placeholderText">No location to show</p>
                                }
                            </div>
                            <div className="accountItem">
                                <h3><PhoneIcon style={{marginRight:"0.5rem"}}/> Phone Number:</h3>
                                {this.state.user.phone ?
                                    <div>{this.state.user.phone}</div>
                                    :
                                    <p className="placeholderText">No phone number to show</p>
                                }
                            </div>
                        </div>

                        <div className="accountStats">
                            <h3><EqualizerIcon style={{marginRight:"0.5rem"}}/> Stats</h3>
                            <p>Joined on: {this.state.user.stats.joined}</p>
                            <p>Listings sold: {this.state.user.stats.listings_sold}</p>
                        </div>
                    </div>

                    <h3>Social Links</h3>
                    <div className="socialLinks">
                        <div className="accountItem">
                            <i className="fab fa-facebook brand-icon" style={{color:"#4267B2"}}/>
                            <div>
                                {this.state.user.facebook ?
                                    <a href={this.state.user.facebook}>{this.state.user.facebook}</a>
                                    :
                                    <p className="placeholderText">No Facebook account to show</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="socialLinks">
                        <div className="accountItem">
                            <i className="fab fa-instagram brand-icon" id="instagram"/>
                            <div>
                                {this.state.user.instagram ?
                                    <a href={this.state.user.instagram}>{this.state.user.instagram}</a>
                                    :
                                    <p className="placeholderText">No Instagram account to show</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="socialLinks">
                        <div className="accountItem">
                            <i className="fab fa-snapchat-square brand-icon" id="snapchat"/>
                            <div>
                                {this.state.user.snapchat ?
                                    <p>{this.state.user.snapchat}</p>
                                    :
                                    <p className="placeholderText">No Snapchat account to show</p>
                                }
                            </div>
                        </div>
                    </div>
                    <br/>
                </div>
            </div>
            }
        </div>
        )
    }
}

export default AccountScreen;