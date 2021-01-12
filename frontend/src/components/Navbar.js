import React from 'react';
import {Link, withRouter} from 'react-router-dom';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import Brightness6Icon from '@material-ui/icons/Brightness6';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

import Login from '../web/Login';

class Navbar extends React.Component{
    constructor(){
        super();
        this.state={
            sidebarOpen: false,
            notificationsOpen: false,
            accountDropdownOpen: false,
        }

        this.openNotifications = this.openNotifications.bind(this);
        this.closeNotifications = this.closeNotifications.bind(this);
        this.openDropdown = this.openDropdown.bind(this);
        this.closeDropdown = this.closeDropdown.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.closeSidebar();
            if(localStorage.getItem("user")){
                this.closeNotifications();
                this.closeDropdown();
            }
        }
    }

    openSidebar(){
        this.setState({sidebarOpen: true})
        document.querySelector(".sidebar").classList.add("open");
        document.querySelector(".overlay").style.pointerEvents = 'all';        
    }

    closeSidebar(){
        this.setState({sidebarOpen: false})
        document.querySelector(".sidebar").classList.remove("open");
        document.querySelector(".overlay").style.pointerEvents = 'none';
    }

    toggleSidebar(){
        if(this.state.sidebarOpen)
            this.closeSidebar()
        else
            this.openSidebar()
    }

    openNotifications(){
        this.closeDropdown();
        this.setState({notificationsOpen: true})
        document.querySelector(".notifications").style.display="block";
    }

    closeNotifications(){
        this.setState({notificationsOpen: false})
        document.querySelector(".notifications").style.display="none";
    }

    toggleNotifications(){
        if(this.state.notificationsOpen)
            this.closeNotifications()
        else
            this.openNotifications()
    }

    openDropdown (){
        this.closeNotifications();
        this.setState({dropdownOpen:true})
        document.querySelector(".dropdown").style.display="block";
    }

    closeDropdown(){
        this.setState({dropdownOpen: false})
        document.querySelector(".dropdown").style.display="none";
    }

    toggleDropdown(){
        if(this.state.dropdownOpen)
            this.closeDropdown()
        else
            this.openDropdown()
    }

    logout(){
        Login.clearAccountInfo();
        this.props.history.push('/')
    }

    render(){
        var user = JSON.parse(localStorage.getItem("user"));
        return (
            <header>
                <div className="logo">
                    <button className="hamburger-btn" onClick={()=>this.toggleSidebar()}>
                        &#9776;
                    </button>
                    <div id="homeLarge"><Link to="/" style={{fontSize:"2rem"}}>RU&nbsp;Connect</Link></div>
                    <div id="homeSmall"><Link to="/"style={{fontSize:"2rem"}}><HomeIcon/></Link></div>
                </div>
                <div className="searchSection">
                    <form action="">
                      <input id="searchBar" className="searchBar" type="text" placeholder="Search for Products..." name="search_term"/>
                      {!(window.location.pathname).includes('searchResults') ? <button className="searchButton" type="submit"><Link to="/searchResults"><SearchIcon/></Link></button> : <button className="searchButton" type="button"><Link><SearchIcon/></Link></button>}
                    </form>
                </div>
                <div className="headerLinks">
                    {user ? 
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <Link to="/makeListing"><div className="headerButton"><AddIcon style={{marginRight:"0.2rem"}}/>New&nbsp;Listing</div></Link>
                        <Link to="/watchlist"><div className="headerButton"><VisibilityIcon style={{marginRight:"0.2rem"}}/>Watchlist</div></Link>
                        <div style={{position:"relative"}}>
                            <button className="dropdownButton" onClick={()=>this.toggleNotifications()}>
                                <NotificationsIcon style={{float:"left"}}/>
                            </button> 
                            <div className="notifications">
                                <div className="arrowUp"/>
                                <div className="dropdownHeader">
                                    <div style={{display: "flex", flexDirection:"column", justifyContent:"center", marginLeft:"0.5rem", padding:"0"}}>
                                        <h3>Notifications</h3>
                                    </div>
                                </div>
                                
                                <div className="dropdownButtons">
                                    <Link>
                                        <button>
                                            From admin: Hello
                                        </button>
                                    </Link>
                                    <Link>
                                        <button>
                                            From admin: I would like to discuss this posting
                                        </button>
                                    </Link>
                                    <Link>
                                        <button>
                                            From admin: Offer for item
                                        </button>
                                    </Link>
                                    <Link>
                                        <button>
                                            From admin: I would like to discuss this posting
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div style={{position:"relative"}}>
                            <button className="dropdownButton" onClick={()=>this.toggleDropdown()}>
                                <img className="profileThumbnail" src={user.imageUrl ? user.imageUrl : "/images/profile.jpg"}  alt="Profile Picture"/>
                            </button>
                            <div className="dropdown">
                                <div className="arrowUp"/>
                                <div className="dropdownHeader">
                                    <img className="dropdownProfilePic" src={user.imageUrl ? user.imageUrl : "/images/profile.jpg"}  alt="Profile Picture"/>
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
                    </div>:
                    <Link to="/login">
                        <div className="headerButton">
                            <ExitToAppIcon style={{marginRight:"0.2rem"}}/>Sign&nbsp;In
                        </div>
                    </Link>}
                </div>
                <div className="overlay" onClick={()=>this.closeSidebar()}/>
                <aside className="sidebar">
                    <div className="sidebarHead">
                        <h1 style={{padding:"2rem 1rem 0rem 1rem"}}>Shopping Categories<hr/></h1>
                        <button className="sidebar-close-btn" onClick={()=>this.closeSidebar()}><CloseIcon/></button>
                    </div>
                    <div className="sidebarCategory">
                        <h4 style={{padding:"1rem 1rem 0rem 1rem"}}>Product Type</h4>
                        <ul>
                            <li>
                                <a href="index.html">Textbooks</a>
                            </li>
                            <li>
                                <a href="index.html">Appliances</a>
                            </li>
                            <li>
                                <a href="index.html">Housing</a>
                            </li>
                            <li>
                                <a href="index.html">Furniture</a>
                            </li>
                            <li>
                                <a href="index.html">Electronics</a>
                            </li>
                        </ul>
                    </div>
                    <div className="sidebarCategory">
                        <h4 style={{padding:"1rem 1rem 0rem 1rem"}}>Seller Location</h4>
                        <ul>
                            <li>
                                <a href="index.html">Busch Campus</a>
                            </li>
                            <li>
                                <a href="index.html">Livingston Campus</a>
                            </li>
                            <li>
                                <a href="index.html">College Ave Campus</a>
                            </li>
                            <li>
                                <a href="index.html">Cook/Douglass Campus</a>
                            </li>
                        </ul>
                    </div>
                </aside>
            </header>
            )
    }
}

export default withRouter(Navbar);