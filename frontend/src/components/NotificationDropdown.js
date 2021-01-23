import React from 'react';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import CloseIcon from '@material-ui/icons/Close';

import User from '../web/User';
import '../styles/NotificationDropdown.css';

class NotificationDropdown extends React.Component{
    constructor(props){
        super(props);
        this.state={
            notificationsOpen: false,
            notifications: [],
            unread: 0
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

    async markRead(){
        if(this.state.unread === 0)
            return;
        
        this.setState(prevState => {
            var notifications = JSON.parse(JSON.stringify(prevState.notifications));
            notifications.forEach(notification => notification.read = true);
            return {notifications, unread: 0}
        })
        await User.markRead();
    }

    async removeNotification(notification_index){
        await User.removeNotification(this.state.notifications[notification_index]._id)
        .then(()=>this.getNotifications())
    }

    countUnread(){
        var unread = 0;
        this.state.notifications.forEach(notification=>{
            if(!notification.read)
                unread++;
        })
        this.setState({unread});
    }

    async getNotifications(){
        await User.getNotifications()
        .then(response =>{
            this.setState({notifications: response.notifications})
        })
        .then(()=>this.countUnread())
    }

    matchDate(date){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return today === date;
    }

    parseTime(time){
        var hour = parseInt(time.substring(0, time.indexOf(':')))
        var parsedTime = (hour % 12).toString() + ":" + time.substring(time.indexOf(':') + 1) + (hour > 12 ? " PM" : " AM");
        return parsedTime;
    }

    async componentDidMount(){
        await this.getNotifications();
    }

    render(){
        return (
            <div style={{position:"relative"}}>
                <button className="dropdownButton" style={{marginLeft: "1rem", position:"relative"}} onClick={()=>{
                    this.toggleNotifications();
                    this.markRead();
                }}>
                    <NotificationsIcon style={{float:"left"}}/>
                    {this.state.unread > 0 && <div className="unreadAlert">{this.state.unread}</div>}
                </button> 
                <div className="notifications">
                    <div className="arrowUp"/>
                    <div className="dropdownHeader">
                        <div style={{display: "flex", flexDirection:"column", justifyContent:"center", marginLeft:"0.5rem", padding:"0"}}>
                            <h3>Notifications</h3>
                        </div>
                    </div>
                    
                    {this.state.notifications.length > 0 ? 
                        this.state.notifications.map((notification, i)=>
                            <div className="notificationItem" key={"notification" + i}>
                                <NotificationImportantIcon style={{marginRight: "1rem"}}/>
                                <div>
                                    <p>{notification.user} is interested in one of your listings</p>
                                    <p style={{width:"100%", textAlign:"right"}}>
                                        {this.matchDate(notification.time[0]) ? 
                                            this.parseTime(notification.time[1])
                                            :
                                            notification.time[0]
                                        }
                                    </p>
                                </div>
                                <div className="deleteButton" onClick={()=>this.removeNotification(i)}><CloseIcon/></div>
                            </div>
                        )
                        :
                        <div style={{width: "100%", textAlign:"center", padding:"1rem 0"}}>No new notifications</div>
                    }
                </div>
            </div>
        )
    }
}

export default NotificationDropdown;