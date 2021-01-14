import React from 'react';
import {Link} from 'react-router-dom';
import data from '../data';
import biotextbook from "../images/biotextbook.jpg";
import calctextbook from "../images/calctextbook.jpg";
import dorm from "../images/dorm.jpeg";
import nicedorm from "../images/nicedorm.jpg";
import kitchen from "../images/kitchen.jpg";

import '../styles/HomeScreen.css';

function HomeScreen(props){
    return <div className="homeContainer">
        <div className="homeCategory" id="homeTextbooks">
            <div className="homeHeader">Textbooks<hr/></div>
            <ul className="products">
                <li>
                    <div className="product">
                        <Link to="">
                            <img className="product-image" src={biotextbook} alt="product"/>
                        </Link>
                        <div className="product-name">
                            <Link to="">
                                Campbell Biology
                            </Link>
                        </div>
                        <div className="product-price">$120</div>
                    </div>
                </li>
                <li>
                <div className="product">
                        <Link to="">
                            <img className="product-image" src={calctextbook} alt="product"/>
                        </Link>
                        <div className="product-name">
                            <Link to="">
                                Calculus Textbook
                            </Link>
                        </div>
                        <div className="product-price">$100</div>
                    </div>
                </li>
            </ul>
        </div>
        <div className="homeCategory" id="homeHousing">
            <div className="homeHeader">Housing<hr/></div>
            <ul className="products">
                <li>
                <div className="product">
                        <Link to="">
                            <img className="product-image" src={dorm} alt="product"/>
                        </Link>
                        <div className="product-name">
                            <Link to="">
                                College Ave Dorm
                            </Link>
                        </div>
                        <div className="product-price">$800</div>
                    </div>
                </li>
                <li>
                <div className="product">
                        <Link to="">
                            <img className="product-image" src={nicedorm} alt="product"/>
                        </Link>
                        <div className="product-name">
                            <Link to="">
                                College Ave Apartment
                            </Link>
                        </div>
                        <div className="product-price">$1300</div>
                    </div>
                </li>
                <li>
                <div className="product">
                        <Link to="">
                            <img className="product-image" src={kitchen} alt="product"/>
                        </Link>
                        <div className="product-name">
                            <Link to="">
                                RU Living Apartment
                            </Link>
                        </div>
                        <div className="product-price">$1600</div>
                    </div>
                </li>
            </ul>
        </div>
        <div className="homeCategory" id="homeAppliances">
            <div className="homeHeader">Appliances<hr/></div>
            <ul className="products">
                {data.products.map((product, i)=>
                <li key={"applicances" + i}>
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
        <div className="homeCategory" id="homeFurniture">
            <div className="homeHeader">Furniture<hr/></div>
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
        <div className="homeCategory" id="homeElectronics">
            <div className="homeHeader">Electronics<hr/></div>
            <ul className="products">
                {data.products.map((product, i)=>
                <li key={"electronics" + i}>
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