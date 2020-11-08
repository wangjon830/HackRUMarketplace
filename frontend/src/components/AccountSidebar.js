import React from 'react';
import {Link} from 'react-router-dom';

function AccountSidebar(props){
    return (
        <div id="AccountOptions" className = "sidenav">
            <Link to="/settings/account"><div className="navItem"><settingActive/>&nbsp;&nbsp;Personal&nbsp;Information</div></Link>
            <Link to="/settings/security"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Login&nbsp;&&nbsp;Security</div></Link>
            <Link to="/settings/transaction"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Your&nbsp;Transactions</div></Link>
            <Link to="/settings/listings"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Your&nbsp;Listings</div></Link>
        </div>
    )
}

export default AccountSidebar;