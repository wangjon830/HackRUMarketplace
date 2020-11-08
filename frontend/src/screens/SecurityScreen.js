import React, {useState, useEffect} from 'react';
import {observer} from "mobx-react";
import UserStore from '../stores/UserStore';
import {Link} from 'react-router-dom';
import AccountSidebar from "../components/AccountSidebar";

function SecurityScreen(props){
    const[email, setEmail] = useState();
    const[password, changePassword] = useState();

    useEffect =async () =>{
      try{
        let res = await fetch('http://127.0.0.1:5000/getAccount', {
            method: 'post',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: UserStore.email
            })
        })

        let result = await res.json();

        if(result && result.success){
            setEmail(result.email);
        }
        else{
            console.log("Could not get account info")
            return;
        }
      }
      catch(e){
          console.log(e);
          return;
      }
    }
    return( 
    <div>
        <div id="AccountOptions" className = "sidenav">
            <Link to="/settings/account"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Personal&nbsp;Information</div></Link>
            <Link to="/settings/security"><div className="navItem"><settingActive/>&nbsp;&nbsp;Login&nbsp;&&nbsp;Security</div></Link>
            <Link to="/settings/transaction"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Your&nbsp;Transactions</div></Link>
            <Link to="/settings/listings"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Your&nbsp;Listings</div></Link>
        </div>
        <div className = "settings">
            <div className = "headText"><h1>Login&nbsp;&&nbsp;Security&nbsp;Settings<hr/></h1></div>
            <div className = "settingsItem">
                <h3>Email</h3>
                <p id="Email">{email}</p>
                <br/>
              <form action="">
                <input className="smallInput" type="text" id="changeEmail" name="email" placeholder="New Email.."/>
                &nbsp;
                <button variant="secondary">Change Email</button>{' '}
              </form>
            </div>
            <div className = "settingsItem">
                <h3>Password</h3>
                <p id="UserLocation">*****</p>
                <br/>
              <form action="">
                <input className="smallInput" type="text" id="oldPassword" name="oldPassword" placeholder="Old Password.."/>
                <br/><br/>
                <input className="smallInput" type="text" id="newPassword" name="newPassword" placeholder="New Password.."/>
                <br/><br/>
                <button variant="secondary">Change Password</button>{' '}
                <a href="">I forgot my password</a>
              </form>
            </div>
        </div>
    </div>
    )
}

export default observer(SecurityScreen);
