import React from 'react';
import {Link} from 'react-router-dom';

function AccountSidebar(props){
    var settingsLinks = [
        {
            link: "/settings/account", 
            text: "Personal Information"
        },
        {
            link: "/settings/security",
            text: "Login \u0026 Security"
        },
        {
            link: "/settings/transaction",
            text: "Your Transactions"
        },
    ]

    return (
        <div id="accountOptions" className = "sidenav">
            {
                settingsLinks.map((link, i)=>{
                    return <Link to={link.link} key={"sidebar" + i}>
                        <div className={props.pathname === link.link ? "navItem active" : "navItem"}>
                            {link.text}
                        </div>
                    </Link>
                })
            }
        </div>
    )
}

export default AccountSidebar;