import React from 'react';
import {Link} from 'react-router-dom';

import User from '../web/User';
import Item from '../web/Item';

class ItemScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            item: null,
            inWatchlist: false,
            currentImage: 0
        }
    }

    async componentDidMount(){
        let query = this.props.location.search;
        var item = (await Item.getItem(query)).item;
        var inWatchlist = await User.isInWatchlist(item._id);
        this.setState({item, inWatchlist})
    }

    changeImage(change){
        var newImage = this.state.currentImage + change;
        if(newImage >= this.state.item.images.length)
            newImage = 0;
        else if (newImage < 0)
            newImage = this.state.item.images.length - 1;
        this.setState({currentImage: newImage})
    }

    render(){
        return (
            <div style={{flex: "1 1"}}>
                {this.state.item && 
                <div className="itemContainer">
                    <div className="itemImages">
                        <div className="imageView">
                            <img src={this.state.item.images[this.state.currentImage]} alt="item"/>
                            {this.state.item.images.length > 1 &&
                                <>
                                    <button className="imageArrowBtn" onClick={() => this.changeImage(-1)}>&lt;</button>
                                    <button className="imageArrowBtn" onClick={() => this.changeImage(1)}>&gt;</button>
                                </>
                            }
                        </div>
                        {this.state.item.images.length > 1 &&
                            <div className="image-gallery">
                                <button className="gallery-arrow-btn" onClick={() => this.changeImage(-1)}>&lt;</button>
                                <button className="gallery-arrow-btn" onClick={() => this.changeImage(1)}>&gt;</button>
                                {this.state.images.map((image, i)=>
                                    <img src={image} style={{border: this.state.currentImage == i ? "2px solid red" : "none"}}/>)}
                            </div>
                        }
                    </div>
                    <div className="listing-details">
                        <div className="listing-header">
                            <h2 className="listing-name">{this.state.item.title}</h2>
                            <p>Seller: <Link to="/">{this.state.item.poster}</Link></p>
                        </div>
                        <div className="listing-info">
                            <p>Condition: {this.state.item.condition}</p>
                        </div>
                        <div className="details-action">
                            <div className="details-action-text">
                                <p>Ask price: <b>${this.state.item.price}</b></p>
                            </div>
                            <div className="details-action-buttons">
                                {this.state.inWatchlist ? 
                                    <button id="watchlist-button" onClick={()=>{
                                        User.removeFromWatchlist(this.state.item._id)
                                        .then(()=>this.setState({inWatchlist: false}))
                                    }}>Remove from watchlist</button>:
                                    <button id="watchlist-button" onClick={()=>{
                                        User.addToWatchlist(this.state.item._id)
                                        .then(()=>this.setState({inWatchlist: true}))
                                    }}>Add to watchlist</button>
                                }
                                <button id="contact-button">Contact seller</button>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default ItemScreen;
