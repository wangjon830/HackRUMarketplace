import React from 'react';
import {Link} from 'react-router-dom';

import User from '../web/User';
import '../styles/Watchlist.css';

class WatchlistScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            watchlist: []
        }
    }

    async componentDidMount(){
        var watchlist = (await User.getWatchlist()).watchlist;
        this.setState({watchlist})
    }

    render(){
        return <div id="watchlistScreen">
            <h1>Watchlist</h1>
            <div className="itemLabels">
                <div id="imageLabel" className="label">Image</div>
                <div id="nameLabel" className="label">Name</div>
                <div id="priceLabel" className="label">Price</div>
                <div id="posterLabel" className="label">Poster</div>
            </div>
            <ul className="items">
                {this.state.watchlist.map((item, i)=>
                    <>
                        <li key={"watchlist" + i} className="item">
                            <div className="itemImage">
                                <Link to={"/listings/?id="+item._id}>
                                    <img src={item.images[0]} alt="product"/>
                                </Link>
                            </div>

                            <Link to={"/listings/?id="+item._id} className="itemName label">
                                {item.title}
                            </Link>
                            <div className="itemPrice label">${item.price}</div>
                            <div className="itemPoster label">{item.poster}</div>
                        </li>
                        <hr style={{width:"100%", margin:"0.5rem 0"}}/>
                    </>
                )}
            </ul>
        </div>
    }
}

export default WatchlistScreen;