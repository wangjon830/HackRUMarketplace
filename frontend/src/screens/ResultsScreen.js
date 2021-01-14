import React from 'react';
import {Link} from 'react-router-dom';

import Item from '../web/Item';

class ResultsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            query: "",
            results: []
        }
    }

    async componentDidMount(){
        let query = this.props.location.search;
        var results = (await Item.search(query)).results; 

        query = query.substring("?q=".length).replaceAll("+", " ");
        this.setState({query, results})
    }
    
    render(){
        return <div className="homeContainer">
            <div className="homeCategory" id="homeTextbooks">
                <div className="homeHeader">
                    Search Results for "<div id="query" style={{color:'#901818',display: 'inline-block'}}>{this.state.query}</div>"
                    <hr/>
                </div>
                <ul className="items">
                    {this.state.results.map((item, i)=>
                        <li key={"result" + i}>
                            <div className="item">
                                <Link to={"/listings/?id="+item._id}>
                                    <img className="itemImage" src={item.images[0]} alt="product"/>
                                </Link>
                                <div className="itemName">
                                    <Link to={"/listings/?id="+item._id}>
                                        {item.title}
                                    </Link>
                                </div>
                                <div className="itemPrice">${item.price}</div>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    }
    
}

export default ResultsScreen;
