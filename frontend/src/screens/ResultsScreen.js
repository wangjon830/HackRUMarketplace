import React from 'react';
import {Link} from 'react-router-dom';
import data from '../data';

function HomeScreen(props){
    async function doSearch(){
        let searchTerm = document.getElementById("searchBar").value;
        document.getElementById('searchTerm').innerHTML = (searchTerm);
        try{
            let res = await fetch('http://127.0.0.1:5000/search', {
                method: 'get',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    
                })
            })

            let result = await res.json();
            console.log(result);
        }
        catch(e){
            console.log(e);
            return;
        }
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

export default HomeScreen;