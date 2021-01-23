import React from 'react';
import {Link} from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';

import Item from '../web/Item';
import User from '../web/User';
import '../styles/Results.css';

class ResultsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            query: "",
            results: [],
            watchlist: []
        }
    }

    async componentDidMount(){
        let query = this.props.location.search;
        var results = (await Item.search(query)).results;
        var watchlist = []; 
        if(User.isLoggedIn()){
            watchlist = (await User.getWatchlist()).watchlist;
        }
        query = query.substring("?q=".length).replaceAll("+", " ");
        this.setState({query, results, watchlist})
    }
    
    render(){
        return <div id="resultsScreen">
            <div className="resultsHeader">
                Search Results for "<div id="query" style={{color:'#901818',display: 'inline-block'}}>{this.state.query}</div>"
                <hr/>
            </div>
            
            {this.state.results.length > 0 ?
                <div className="resultsContent">
                    <div className="filterSection">

                    </div>
                    <ul className="items">
                        {this.state.results.map((item, i)=>
                            <li key={"result" + i}>
                                <div className="item">
                                    <div className="itemImage">
                                        <Link to={"/listings/"+item._id}>
                                            <img src={item.images[0]} alt="product"/>
                                        </Link>
                                    </div>

                                    <div className="itemInfo">
                                        <div className="itemName">
                                            <Link to={"/listings/"+item._id} className="label">
                                                {item.title}
                                            </Link>
                                        </div>
                                        <div className="itemPoster label">{item.poster}</div>
                                        <div className="itemCondition label"><b>Condition: </b>{item.condition}</div>
                                    </div>
                                    
                                    <div className="itemButtons">
                                        <div className="itemPrice label">${Number(item.price).toFixed(2)}</div>
                                        {item._id in this.state.watchlist ?  
                                            <button className="watchlistBtn" onClick={()=>{
                                                User.removeFromWatchlist(item._id)
                                                .then(response=>this.setState({watchlist: response.watchlist}))
                                            }}>
                                                <VisibilityIcon style={{marginRight: "0.5rem"}}/>Remove from watchlist
                                            </button>
                                            :
                                            <button className="watchlistBtn" onClick={()=>{
                                                User.addToWatchlist(item._id)
                                                .then(response=>this.setState({watchlist: response.watchlist}))
                                            }}>
                                                <VisibilityIcon style={{marginRight: "0.5rem"}}/>Add to watchlist
                                            </button>
                                        }
                                    </div>
                                </div>
                                <hr/> 
                            </li>
                        )}
                    </ul>
                </div>
                :
                <div className="placeholderText">No results found</div>
            }
        </div>
    }
    
}

export default ResultsScreen;
