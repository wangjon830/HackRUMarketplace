import React from 'react';
import {Link} from 'react-router-dom';
import data from '../data';

function AccountScreen(props){
    return( 
    <div>
        <div id="AccountOptions" className = "sidenav">
            <Link to="/settings/account"><div className="navItem"><settingActive/>&nbsp;&nbsp;Personal Information</div></Link>
            <Link to="/settings/security"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Login & Security</div></Link>
            <Link to="/settings/transaction"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Your Transactions</div></Link>
            <Link to="/settings/listings"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Your Listings</div></Link>
        </div>
        <div className = "settings">
            <div className = "headText"><h1>Personal Information<hr/></h1></div>
            <div className = "settingsItem">
                <h3>Profile Picture</h3>
                <div className="profilePic"><img src="" alt="Profile Picture"></img></div>
                <br/>
              <form action="">
                <button variant="secondary">Change Profile Picture</button>{' '}
              </form>
            </div>
            <div className = "settingsItem">
                <h3>Displayed Name</h3>
                <p id="Username">Jonathan Wang</p>
                <br/>
              <form action="">
                <input className="smallInput" type="text" id="changeName" name="username" placeholder="New Name.."/>
                &nbsp;
                <button variant="secondary">Change Name</button>{' '}
              </form>
            </div>
            <div className = "settingsItem">
                <h3>Location</h3>
                <p id="UserLocation">Busch Campus</p>
                <br/>
              <form action="">
                <input className="smallInput" type="text" id="changeLocation" name="location" placeholder="New Location.."/>
                &nbsp;
                <button variant="secondary">Change Location</button>{' '}
              </form>
            </div>
            <div className = "settingsItem">
                <h3>Phone Number</h3>
                <p id="UserPhone">732-123-4567</p>
                <br/>
              <form action="">
                <input className="smallInput" type="text" id="changeNumber" name="phone" placeholder="New Number.."/>
                &nbsp;
                <button variant="secondary">Change Number</button>{' '}
              </form>
            </div>
            <div className = "settingsItem">
                <h3>Social Links</h3>
                <div className="socialLinks">
                    <p><a id="Facebook" href="http://www.facebook.com">Facebook</a></p>
                      <form action="">
                        <input className="smallInput" type="text" id="changeNumber" name="facebook" placeholder="New Facebook.."/>
                        &nbsp;
                        <button variant="secondary">Change</button>{' '}
                      </form>
                    <p><a id="Instagram" href="http://www.instagram.com">Instagram</a></p>
                      <form action="">
                        <input className="smallInput" type="text" id="changeInsta" name="insta" placeholder="New Insta.."/>
                        &nbsp;
                        <button variant="secondary">Change</button>{' '}
                      </form>
                    <p>Snapchat Username</p>
                      <form action="">
                        <input className="smallInput" type="text" id="changeSnap" name="snap" placeholder="New Snap.."/>
                        &nbsp;
                        <button variant="secondary">Change</button>{' '}
                      </form>
                </div>
                <br/>
            </div>
            <div className = "settingsItem">
                <h3>Bio</h3>
                <p id="UserBio">Hello friend</p>
                <br/>
              <form action="">
                <textarea className="largeInput" name="Text1" cols="40" rows="5" placeholder="New Bio.."></textarea>
                <br/>
                <br/>
                <button variant="secondary">Change Bio</button>{' '}
              </form>
            </div>
        </div>
    </div>
    )
}

export default AccountScreen;