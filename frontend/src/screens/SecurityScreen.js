import React from 'react';
import {Link} from 'react-router-dom';
import data from '../data';
import '../styles/Account.css'

function SecurityScreen(props){
    return( 
    <div>
        <div id="AccountOptions" className = "sidenav">
            <Link to="/AccountSettings"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Personal Information</div></Link>
            <Link to="/SecuritySettings"><div className="navItem"><settingActive/>&nbsp;&nbsp;Login & Security</div></Link>
            <Link to="/TransactionsSettings"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Your Transactions</div></Link>
            <Link to="/ListingsSettings"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Your Listings</div></Link>
        </div>
        <div className = "settings">
            <div className = "headText"><h1>Login & Security Settings<hr/></h1></div>
            <div className = "settingsItem">
                <h3>Email</h3>
                <p id="Email">jw1303@scarletmail.rutgers.edu</p>
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

export default SecurityScreen;