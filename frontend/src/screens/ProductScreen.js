import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import data from '../data';

function ProductScreen(props){
    const product = data.products.find(x=>x._id === props.match.params.id);
    const [currentImage, setImage] = useState(0);
    const changeImage = (change)=>{
        var newImage = currentImage + change;
        if(newImage >= product.images.length)
            newImage = 0;
        else if (newImage < 0)
            newImage = product.images.length - 1;
        setImage(newImage)
    }

    return (
    <div>
        <div>
            <Link to="/">Back to home</Link>
        </div>
        <div className="listing">
            <div className="listing-images">
                <div className="image-view">
                    <img src={product.images[currentImage]} alt="product"/>
                    <button className="image-arrow-btn" onClick={() => changeImage(-1)}>&lt;</button>
                    <button className="image-arrow-btn" onClick={() => changeImage(1)}>&gt;</button>
                </div>
                <div className="image-gallery">
                    <button className="gallery-arrow-btn" onClick={() => changeImage(-1)}>&lt;</button>
                    <button className="gallery-arrow-btn" onClick={() => changeImage(1)}>&gt;</button>
                    {product.images.map(image=>
                        <img src={image}/>)}
                </div>
            </div>
            <div className="listing-details">
                <div className="listing-header">
                    <h2 className="listing-name">{product.name}</h2>
                    <p>Seller: <Link to="/">{product.seller}</Link></p>
                </div>
                <div className="listing-info">
                    <p>Condition: {product.condition}</p>
                </div>
                <div className="details-action">
                    <div className="details-action-text">
                        <p>Ask price: <b>${product.price}</b></p>
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

export default ProductScreen;