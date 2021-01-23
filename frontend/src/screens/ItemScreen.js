import React from 'react';
import {Link} from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';

import User from '../web/User';
import Item from '../web/Item';
import '../styles/Item.css';

class ItemScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            item: null,
            poster_name: null,
            inWatchlist: false,
            currentImage: 0,
            userList: []
        }
    }

    async componentDidMount(){
        let id = this.props.match.params.id;
        var item = (await Item.getItem(id)).item;
        item.category = item.category.charAt(0).toUpperCase() + item.category.slice(1)
        item.condition = item.condition.charAt(0).toUpperCase() + item.condition.slice(1)
        var inWatchlist = await User.isInWatchlist(item._id);
        var poster = (await User.getAccount(item.poster)).user;
        var userList = [];
        if(User.isUser(poster._id))
            userList = (await User.getUserList(id)).user_list;
        this.setState({item, inWatchlist, poster_name: poster.firstName + " " + poster.lastName, userList})
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
            <div id="itemScreen" style={{flex: "1 1"}}>
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
                                    <img src={image} style={{border: this.state.currentImage === i ? "2px solid red" : "none"}}/>)}
                            </div>
                        }
                    </div>
                    <div className="listing-details">
                        <div className="listing-header">
                            <h2 className="listing-name">{this.state.item.title}</h2>
                            <p>Posted on:&nbsp;&nbsp;{this.state.item.date}</p>
                            <p>Poster:&nbsp;&nbsp;<Link to={"/account/" + this.state.item.poster}>{this.state.poster_name}</Link></p>
                        </div>
                        <div className="listing-info">
                            <div style={{display:'flex'}}>
                                <p>Description: </p>
                                <p style={{marginLeft: "0.5rem"}}>{this.state.item.description}</p>
                            </div>
                            <p>Category: {this.state.item.category}</p>
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
                        
                        {User.isUser(this.state.item.poster) && 
                            <div className="userList">
                                <div style={{display:'flex', alignItems:'center', fontSize:'1.3rem', margin: '1rem'}}>
                                    <VisibilityIcon style={{marginRight:"0.5rem"}}/>Users interested
                                </div>
                                {this.state.userList.map((user, i)=>
                                    <Link to={"/account/" + user._id}  key={"user" + i} className="userItem">
                                        <img className="profilePic" 
                                            src={user.profilePic ? user.profilePic : "/images/profile.jpg"} 
                                            alt="Profile"
                                        />
                                        {user.name}
                                    </Link>
                                )}
                            </div>
                        }
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default ItemScreen;
