import React from 'react';
import {Link} from 'react-router-dom';

import CloseIcon from '@material-ui/icons/Close';

import '../styles/Sidebar.css';

class Sidebar extends React.Component{
    constructor(){
        super();
        this.state={
            sidebarOpen: false,
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

    render(){
        return (
            <div id="sidebar">
                <div className="logo">
                    <button className="hamburger-btn" onClick={()=>this.toggleSidebar()}>
                        &#9776;
                    </button>
                    <div id="homeLarge"><Link to="/" style={{fontSize:"2rem"}}>RU&nbsp;Connect</Link></div>
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
            </div>
            )
    }
}

export default Sidebar;