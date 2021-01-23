import React from 'react';
import {Link} from 'react-router-dom';

import User from '../web/User';
import '../styles/Watchlist.css';

class WatchlistScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            watchlist: {}
        }
    }

    async removeItem(item_id){
        await User.removeFromWatchlist(item_id)
        .then(response=>{
            this.setState(prevState=>{
                var watchlist = prevState.watchlist;
                delete watchlist[item_id];
                return {watchlist}
            })
        })
    }

    async componentDidMount(){
        var watchlist = (await User.getWatchlistData()).watchlist;
        this.setState({watchlist})
    }

    render(){
        return <div id="watchlistScreen">
            <h1>Watchlist</h1>
            <div className="itemLabels">
                <div className="itemImage label">Image</div>
                <div className="itemName label">Name</div>
                <div className="itemPrice label">Price</div>
                <div className="itemPoster label">Poster</div>
                <div className="buttonSection"/>
            </div>
            <hr/>
            {
                Object.keys(this.state.watchlist).length > 0 ? 
                <ul className="items">
                    {Object.keys(this.state.watchlist).map((item_id, i)=>{
                        var item = this.state.watchlist[item_id];
                        return <li key={"watchlist" + i} style={{width: "100%"}}>
                            <hr style={{width:"100%"}}/>
                            <div className="item">
                                <div className="itemImage">
                                    <Link to={"/listings/"+item_id}>
                                        <img src={item.images[0]} alt="product"/>
                                    </Link>
                                </div>

                                <div className="itemName">
                                    <Link to={"/listings/"+item_id} className="label">
                                        {item.title}
                                    </Link>
                                </div>
                                
                                <div className="itemPrice label">${item.price}</div>
                                <div className="itemPoster label">{item.poster}</div>
                                <div className="buttonSection">
                                    <button onClick={()=>this.removeItem(item_id)}>
                                        Remove    
                                    </button>    
                                </div>
                            </div> 
                        </li>
                    }
                    )}
                </ul>
                :
                <div className="placeholderText">No items on your watchlist</div>
            }
            
        </div>
    }
}

export default WatchlistScreen;