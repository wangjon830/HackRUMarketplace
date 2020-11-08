import React from 'react';
import {Link} from 'react-router-dom';
import data from '../data';
import biotextbook from "../images/biotextbook.jpg";
import calctextbook from "../images/calctextbook.jpg";

function ResultsScreen(props){
    var results;
    function doSearch(){
        let searchTerm = document.getElementById("searchBar").value;
        var request = new XMLHttpRequest();
        request.open("GET", "http://127.0.0.1:5000/search?searchTerm=" + searchTerm);
        request.onload = function() {
            results = request.response;
            console.log(results);
        };
        request.send();
        //console.log(this.setItem);
    }
    return <div className="homeContainer" onLoad={doSearch}>
        <div className="homeCategory" id="homeTextbooks">
            <div className="homeHeader">Search Results for textbook<hr/></div>
            <ul className="products">
                <li>
                    <div className="product">
                        <Link to="/listings/5fa7f43aa22b740eaba2a950">
                            <img className="product-image" src={biotextbook} alt="product"/>
                        </Link>
                        <div className="product-name">
                            <Link to="/listings/5fa7f43aa22b740eaba2a950">
                                Campbell Biology
                            </Link>
                        </div>
                        <div className="product-price">$120</div>
                    </div>
                </li>
                <li>
                <div className="product">
                        <Link to="">
                            <img className="product-image" src={calctextbook} alt="product"/>
                        </Link>
                        <div className="product-name">
                            <Link to="">
                                Calculus Textbook
                            </Link>
                        </div>
                        <div className="product-price">$100</div>
                    </div>
                </li>
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
