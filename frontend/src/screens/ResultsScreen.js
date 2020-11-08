import React from 'react';
import {Link} from 'react-router-dom';
import data from '../data';

function ResultsScreen(props){
    async function doSearch(){
        let searchTerm = document.getElementById("searchBar").value;
        document.getElementById('searchTerm').innerHTML = (searchTerm);
        var request = new XMLHttpRequest();
        request.open("GET", 'http://127.0.0.1:5000/search?searchTerm=' + searchTerm);
        request.onload = function() {
            this.setItem = request.response;
        };
        request.send();
        console.log(request.response);
    }
    return <div className="homeContainer" onLoad={doSearch}>
        <div className="homeCategory" id="homeTextbooks">
            <div className="homeHeader">Search Results for <div id="searchTerm" style={{color:'#901818',display: 'inline-block'}}></div><hr/></div>
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
}

export default ResultsScreen;
