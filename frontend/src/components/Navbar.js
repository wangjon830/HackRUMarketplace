import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

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
            <Link to="/">RU Connect</Link>
        </div>
        <div className="header-links">
            <a href="watchlist.html"><VisibilityIcon style={{marginRight:"0.2rem"}}/>Watchlist</a>
            <a href="signin.html"><ExitToAppIcon style={{marginRight:"0.2rem"}}/>Sign In</a>
        </div>
        <aside className="sidebar">
            <h3>Shopping Categories</h3>
            <button className="sidebar-close-btn" onClick={closeSidebar}>X</button>
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
            </ul>
        </aside>
    </header>
    )
}

export default Navbar;