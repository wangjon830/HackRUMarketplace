import React,{useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

class ItemScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            itemName: '',
            poster: '',
            description: '',
            price: '',
            trade: '',
            categories: [],
            condition: '',
            images: [],
            currentImage: 0
        }
        this.setItem = this.setItem.bind(this);
    }

    setItem(itemJson){
        this.setState({
            itemName: itemJson.name,
            poster: itemJson.poster,
            description: itemJson.description,
            price: itemJson.price,
            trade: itemJson.trade,
            categories: itemJson.categories,
            condition: itemJson.condition,
            images: itemJson.images,
        })
    }

    async componentDidMount(){
        var request = new XMLHttpRequest();
        request.open("GET", "http://127.0.0.1:5000/getItem/?id=" + this.props.match.params.id);
        request.onload = function() {
            this.setItem = request.response;
        };
        request.send();
        console.log(request.response);
    }

    changeImage(change){
        var newImage = this.state.currentImage + change;
        if(newImage >= this.state.images.length)
            newImage = 0;
        else if (newImage < 0)
            newImage = this.state.images.length - 1;
        this.setState({currentImage: newImage})
    }

    render(){
        return (
            <div style={{flex: "1 1"}}>
                <div className="itemContainer">
                    <div className="itemImages">
                        <div className="imageView">
                            <img src={this.state.images[this.state.currentImage]} alt="item"/>
                            <button className="imageArrowBtn" onClick={() => this.changeImage(-1)}>&lt;</button>
                            <button className="imageArrowBtn" onClick={() => this.changeImage(1)}>&gt;</button>
                        </div>
                        <div className="image-gallery">
                            <button className="gallery-arrow-btn" onClick={() => this.changeImage(-1)}>&lt;</button>
                            <button className="gallery-arrow-btn" onClick={() => this.changeImage(1)}>&gt;</button>
                            {this.state.images.map((image, i)=>
                                <img src={image} style={{border: this.state.currentImage == i ? "2px solid red" : "none"}}/>)}
                        </div>
                    </div>
                    <div className="listing-details">
                        <div className="listing-header">
                            <h2 className="listing-name">{this.state.name}</h2>
                            <p>Seller: <Link to="/">{this.state.poster}</Link></p>
                        </div>
                        <div className="listing-info">
                            <p>Condition: {this.state.condition}</p>
                        </div>
                        <div className="details-action">
                            <div className="details-action-text">
                                <p>Ask price: <b>${this.state.price}</b></p>
                            </div>
                            <div className="details-action-buttons">
                                <button id="watchlist-button">Add to watchlist</button>
                                <button id="contact-button">Contact seller</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ItemScreen;
