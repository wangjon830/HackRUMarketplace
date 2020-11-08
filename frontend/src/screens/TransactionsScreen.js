import React,{useState} from 'react';
import AccountSidebar from "../components/AccountSidebar";
import {Link} from 'react-router-dom';
import data from '../data';

function TransactionsScreen(props){
    const product = data.products.find(x=>x._id === props.match.params.id);
    const [currentImage, setImage] = useState(0);
    const changeImage = (change)=>{
        var newImage = currentImage + change;
        if(newImage >= product.images.length)
            newImage = 0;
        else if (newImage < 0)
            newImage = product.images.length - 1;
        setImage(newImage)
    }

    return( 
    <div>
        <div id="AccountOptions" className = "sidenav">
            <Link to="/settings/account"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Personal&nbsp;Information</div></Link>
            <Link to="/settings/security"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Login&nbsp;&&nbsp;Security</div></Link>
            <Link to="/settings/transaction"><div className="navItem"><settingActive/>&nbsp;&nbsp;Your&nbsp;Transactions</div></Link>
            <Link to="/settings/listings"><div className="navItem"><settingStatus/>&nbsp;&nbsp;Your&nbsp;Listings</div></Link>
        </div>
        <div className = "settings">
            <div className = "headText"><h1>Your&nbsp;Transactions<hr/></h1></div>
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

export default TransactionsScreen;