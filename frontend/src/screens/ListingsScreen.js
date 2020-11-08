import React from 'react';
import {Link} from 'react-router-dom';
import AccountSidebar from "../components/AccountSidebar";
import data from '../data';

function ListingsScreen(props){
    return( 
    <div>
        <AccountSidebar/>
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