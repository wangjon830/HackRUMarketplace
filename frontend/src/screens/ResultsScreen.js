import React from 'react';
import {Link} from 'react-router-dom';
import data from '../data';

class ResultsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            results: []
        }
    }

    doSearch(){
        console.log(this.props.location.state);
        let searchTerm = this.props.params.searchTerm;
        document.getElementById('searchTerm').innerHTML = (searchTerm);
        var request = new XMLHttpRequest();
        request.open("GET", "http://127.0.0.1:5000/search?searchTerm=" + searchTerm);
        request.onload = function() {
             let results = request.response;
            console.log(results);
        };
        request.send();
        //console.log(this.setItem);
    }
    
    render(){
        return <div className="homeContainer" onLoad={()=>this.doSearch()}>
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
    
}

export default ResultsScreen;
