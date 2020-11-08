import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import CloseIcon from '@material-ui/icons/Close';
import {observer} from "mobx-react";
import UserStore from '../stores/UserStore';

import AccountDropdown from './AccountDropdown';

function Navbar(props){
    const [sidebarOpen, setSidebar] = useState(false);
    
    const openSidebar = ()=>{
        setSidebar(true)
        document.querySelector(".sidebar").classList.add("open");
    }

    const closeSidebar = ()=>{
        setSidebar(false)
        document.querySelector(".sidebar").classList.remove("open");
    }

    const toggleSidebar = ()=>{
        if(sidebarOpen)
            closeSidebar()
        else
            openSidebar()
    }

    return (
    <header>
        <div className="logo">
            <button className="hamburger-btn" onClick={toggleSidebar}>
                &#9776;
            </button>
            <div id="homeLarge"><Link to="/" style={{fontSize:"2rem"}}>RU&nbsp;Connect</Link></div>
            <div id="homeSmall"><Link to="/"style={{fontSize:"2rem"}}><HomeIcon/></Link></div>
        </div>
        <div className="searchSection">
            <form action="">
              <input className="searchBar" type="text" placeholder="Search for Products..." name="search"/>
              <button className="searchButton" type="submit"><SearchIcon/></button>
            </form>
        </div>
        <div className="header-links">
            <a href="watchlist.html"><VisibilityIcon style={{marginRight:"0.2rem"}}/>Watchlist</a>
            <Link to="/settings/account"><AccountCircleIcon style={{marginRight:"0.2rem"}}/>Account&nbsp;Settings</Link>
            {UserStore.loggedIn ? <AccountDropdown/> : <Link to="/login"><ExitToAppIcon style={{marginRight:"0.2rem"}}/>Sign&nbsp;In</Link>}
        </div>
        <aside className="sidebar">
            <div className="sidebarHead">
                <h1 style={{padding:"2rem 1rem 0rem 1rem"}}>Shopping Categories<hr/></h1>
                <button className="sidebar-close-btn" onClick={closeSidebar}><CloseIcon/></button>
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

export default observer(Navbar);