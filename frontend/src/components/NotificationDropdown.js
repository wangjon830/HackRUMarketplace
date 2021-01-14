import React from 'react';
import {Link} from 'react-router-dom';
import NotificationsIcon from '@material-ui/icons/Notifications';

import '../styles/NotificationDropdown.css';

class NotificationDropdown extends React.Component{
    constructor(props){
        super(props);
        this.state={
            notificationsOpen: false
        }
    }

    openNotifications(){
        this.props.closeDropdown();
        this.setState({notificationsOpen: true});
        document.querySelector(".notifications").style.display="block";
    }

    closeNotifications(){
        this.setState({notificationsOpen: false});
        document.querySelector(".notifications").style.display="none";
    }

    toggleNotifications(){
        if(this.state.notificationsOpen)
            this.closeNotifications()
        else
            this.openNotifications()
    }

    render(){
        return (
            <div style={{position:"relative"}}>
                <button className="dropdownButton" style={{marginLeft: "1rem"}} onClick={()=>this.toggleNotifications()}>
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
                                From Me: pee
                            </button>
                        </Link>
                        <Link>
                            <button>
                                From Rahul: i love u
                            </button>
                        </Link>
                        <Link>
                            <button>
                                From God: die
                            </button>
                        </Link>
                        <Link>
                            <button>
                                From ???: help
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default NotificationDropdown;