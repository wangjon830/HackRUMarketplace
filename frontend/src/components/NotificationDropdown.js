import React,{useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import NotificationsIcon from '@material-ui/icons/Notifications';

import {observer} from "mobx-react";
import UserStore from '../stores/UserStore';

function NotificationDropdown(){
    let history = useHistory();
    const [notificationsOpen, setNotifications] = useState(false);

    const openNotifications = ()=>{
        setNotifications(true)
        document.querySelector(".notifications").style.display="block";
    }

    const closeNotifications = ()=>{
        setNotifications(false)
        document.querySelector(".notifications").style.display="none";
    }

    const toggleNotifications = ()=>{
        if(notificationsOpen)
            closeNotifications()
        else
            openNotifications()
    }

    return (
        <div style={{position:"relative"}}>
            <button className="dropdownButton" onClick={()=>toggleNotifications()}>
                <NotificationsIcon style={{float:"left"}}/>
                {notificationsOpen ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
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

export default observer(NotificationDropdown);