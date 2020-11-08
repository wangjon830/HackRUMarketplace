import React from 'react';
import AccountSidebar from "../components/AccountSidebar";

function SecurityScreen(props){
    return( 
    <div>
        <AccountSidebar/>
        <div className = "settings">
            <div className = "headText"><h1>Login&nbsp;&&nbsp;Security&nbsp;Settings<hr/></h1></div>
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