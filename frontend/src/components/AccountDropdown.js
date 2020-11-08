import React,{useState} from 'react';
import {Link, withRouter} from 'react-router-dom';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import SettingsIcon from '@material-ui/icons/Settings';
import Brightness6Icon from '@material-ui/icons/Brightness6';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {observer} from "mobx-react";
import UserStore from '../stores/UserStore';

class AccountDropdown extends React.Component {
    constructor(props){
        super(props)
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.props.closeDropdown();
        }
    }

    toggleDropdown(){
        if(this.props.dropdownOpen)
            this.props.closeDropdown()
        else
            this.props.openDropdown()
    }

    logout(){
        this.props.closeDropdown();
        UserStore.loggedIn = false;
        UserStore.firstName = "";
        UserStore.lastName = "";
        UserStore.email = "";
        UserStore.profilePic = null;
        // history.go(0);
    }

    render(){
        return (
            <div style={{position:"relative"}}>
                <button className="dropdownButton" onClick={()=>this.toggleDropdown()}>
                    <img className="profileThumbnail" src="/images/profile.jpg" alt="Profile Picture"/>
                    {this.props.dropdownOpen ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                </button>
                <div className="dropdown">
                    <div className="arrowUp"/>
                    <div className="dropdownHeader">
                        <img className="dropdownProfilePic" src="/images/profile.jpg" alt="Profile Picture"/>
                        <div style={{display: "flex", flexDirection:"column", justifyContent:"center", marginLeft:"0.5rem"}}>
                            <p id="dropdownName">{UserStore.firstName + " " + UserStore.lastName}</p>
                            <p id="dropdownEmail">{UserStore.email}</p>
                        </div>
                    </div>
                    <div className="dropdownButtons">
                        <Link to="/settings/account">
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
                        <button onClick={this.logout}>
                            <ExitToAppIcon className="dropdownIcon"/>Sign out
                        </button>
                    </div>
                </div>
            </div>
        )
    }
   
}

export default observer(withRouter(AccountDropdown));