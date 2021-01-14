import React from 'react';
import {Link, withRouter} from 'react-router-dom';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddIcon from '@material-ui/icons/Add';

import Searchbar from './Searchbar';
import Sidebar from './Sidebar';
import AccountDropdown from './AccountDropdown';
import NotificationDropdown from './NotificationDropdown';

import '../styles/Navbar.css';

class Navbar extends React.Component{
    constructor(){
        super();
        this.sidebar = React.createRef();
        this.notificationDropdown = React.createRef();
        this.accountDropdown = React.createRef();
    }

    redirect(){
        this.props.history.push('/');
    }

    componentDidUpdate(prevProps) {
        var user = JSON.parse(window.localStorage.getItem('user'))
        if (this.props.location.pathname !== prevProps.location.pathname && user) {
            this.sidebar.current.closeSidebar();
            this.notificationDropdown.current.closeNotifications();
            this.accountDropdown.current.closeDropdown();
        }
    }

    render(){
        var user = JSON.parse(localStorage.getItem("user"));
        return (
            <header style={{display: 'flex', alignItems: 'center'}}>
                <Sidebar ref={this.sidebar}/>
                <Searchbar/>
                <div className="headerLinks"> 
                    {user ?
                        <div style={{display: 'flex', justifyContent:'center', alignItems:'center'}}>
                            <Link to="/makeListing"><div className="headerButton"><AddIcon style={{marginRight:"0.2rem"}}/>New&nbsp;Listing</div></Link>
                            <Link to="/watchlist"><div className="headerButton"><VisibilityIcon style={{marginRight:"0.2rem"}}/>Watchlist</div></Link>
                            <NotificationDropdown closeDropdown={()=>this.accountDropdown.current.closeDropdown} ref={this.notificationDropdown} />
                            <AccountDropdown closeNotifications={()=>this.notificationDropdown.current.closeNotifications} redirect={()=>this.redirect()} ref={this.accountDropdown}/>
                        </div>
                        :
                        <Link to="/login">
                            <div className="headerButton">
                                <ExitToAppIcon style={{marginRight:"0.2rem"}}/>Sign&nbsp;In
                            </div>
                        </Link>
                    }
                </div>
            </header>
            )
    }
}

export default withRouter(Navbar);