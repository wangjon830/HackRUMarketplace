import React from 'react';
import {Link} from 'react-router-dom';
import data from '../data';


function ListingsScreen(props){
    return( 
    <div>
        <div id="AccountOptions" className = "sidenav">
            <Link to="/settings/account"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Personal Information</div></Link>
            <Link to="/settings/security"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Login & Security</div></Link>
            <Link to="/settings/transaction"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Your Transactions</div></Link>
            <Link to="/settings/listings"><div className="navItem"><settingActive/>&nbsp;&nbsp;Your Listings</div></Link>
        </div>
        <div className = "settings">
            <div className = "headText"><h1>Your Listings<hr/></h1></div>
            <ul className="products">
                {data.products.map(product=>
                <li>
                    <div className="product">
                        <Link to={"/products/"+product._id}>
                            <img className="product-image" src={product.images[0]} alt="product"/>
                        </Link>
                        <div className="product-name">
                            <Link to={"/products/"+product._id}>
                                {product.name}
                            </Link>
                        </div>
                        <div className="product-price">${product.price}</div>
                    </div>
                </li>
                )}
            </ul>
        </div>
    </div>
    )
}

export default ListingsScreen;