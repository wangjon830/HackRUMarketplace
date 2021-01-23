import React from 'react';
import {Link} from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import Brightness6Icon from '@material-ui/icons/Brightness6';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import User from '../web/User';

import '../styles/AccountDropdown.css';

class AccountDropdown extends React.Component {
    constructor(props){
        super(props)
        this.state={
            dropdownOpen:false
        }
    }

    openDropdown (){
        this.props.closeNotifications();
        this.setState({dropdownOpen:true})
        document.querySelector(".dropdown").style.display="block";
    }

    closeDropdown(){
        this.setState({dropdownOpen: false})
        document.querySelector(".dropdown").style.display="none";
    }

    toggleDropdown(){
        if(this.state.dropdownOpen)
            this.closeDropdown();
        else
            this.openDropdown();
    }

    logout(){
        this.closeDropdown();
        this.props.closeNotifications();
        User.clearAccountInfo();
        this.props.redirect();
    }

    render(){
        var user = JSON.parse(window.localStorage.getItem('user'))
        return (
            <div style={{position:"relative"}}>
                <button className="dropdownButton" onClick={()=>this.toggleDropdown()}>
                    <img className="profileThumbnail" src={user.profilePic ? user.profilePic : "/images/profile.jpg"}  alt="Profile"/>
                </button>
                <div className="dropdown">
                    <div className="arrowUp"/>
                    <div className="dropdownHeader">
                        <img className="dropdownProfilePic" src={user.profilePic ? user.profilePic : "/images/profile.jpg"}  alt="Profile"/>
                        <div style={{display: "flex", flexDirection:"column", justifyContent:"center", marginLeft:"0.5rem"}}>
                            <p id="dropdownName">{user.firstName + " " + user.lastName}</p>
                            <p id="dropdownEmail">{user.email}</p>
                        </div>
                    </div>
                    <div className="dropdownButtons">
                        <Link to="/settings/account" onClick={()=>{this.closeDropdown()}}>
                            <button>
                                <SettingsIcon className="dropdownIcon"/>Account settings
                            </button>
                        </Link>
                        <button>
                            <Brightness6Icon className="dropdownIcon"/>Appearance
                        </button>
                        <Link>
                            <button>
                                <HelpOutlineIcon className="dropdownIcon"/>Help
                            </button>
                        </Link>
                        <Link>
                            <button>
                                <ChatBubbleIcon className="dropdownIcon"/>Send feedback
                            </button>
                        </Link>
                        <button onClick={()=>{this.logout()}}>
                            <ExitToAppIcon className="dropdownIcon"/>Sign out
                        </button>
                    </div>
                </div>
            </div>
        )
    }
   
}

export default AccountDropdown;