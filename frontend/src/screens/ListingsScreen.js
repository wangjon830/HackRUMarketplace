import React from 'react';
import {Link} from 'react-router-dom';

import User from '../web/User';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import '../styles/Listings.css';

class ListingsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listings: {},
            removeListing: null
        }
    }

    async getListings(){
        var listings = (await User.getListingData()).listings;
        this.setState({listings});
    }

    async deleteListing(item_id){
        await User.deleteListing(item_id);
        this.getListings();
    }

    async componentDidMount(){
        this.getListings();
    }

    render(){
        return( 
            <div id="listingsScreen">
                
                {this.state.removeListing && 
                    <>
                        <div className="overlay" onClick={()=>this.setState({removeListing: null})}/>
                        <div className="confirmWindow">
                            <div className="closeBtn" onClick={()=>this.setState({removeListing: null})}>
                                <CloseIcon/>
                            </div>
                            <p style={{marginLeft:"1rem"}}>This listing will be removed:</p>
                            <div style={{display: "flex", alignItems:"center", margin:"2rem 0", padding: "0 2rem"}}>
                                <div className="itemImage" style={{width: "20%"}}>
                                    <img src={this.state.removeListing.images[0]} alt="product"/>
                                </div>
                                <div className="itemName label" style={{fontSize:"1.2rem"}}>
                                    {this.state.removeListing.title}
                                </div>
                            </div>

                            <div className="buttonSection">
                                <button style={{color: "#1657fa"}} onClick={()=>{
                                    this.deleteListing(this.state.removeListing._id);
                                    this.setState({removeListing: null});
                                }}>Confirm</button>
                                <button style={{color: "#ff3d3d"}} onClick={()=>this.setState({removeListing: null})}>Cancel</button>
                            </div>
                        </div>
                    </>
                }

                <div className="pageContent">
                    <div className = "settingsHeader">
                        <h1>Your&nbsp;Listings</h1>
                    </div>
                    <div className="itemLabels">
                        <div className="itemImage label">Image</div>
                        <div className="itemName label">Name</div>
                        <div className="itemPrice label">Price</div>
                        <div className="itemDate label">Posted on</div>
                        <div className="itemUserCount label">Users interested</div>
                        <div className="buttonSection"/>
                        <div className="buttonSection"/>
                    </div>
                    <hr style={{width:"100%"}}/>
                    {Object.keys(this.state.listings).length > 0 ? 
                        <ul className="items">
                            {Object.keys(this.state.listings).map((listing_id, i)=>{
                                var listing = this.state.listings[listing_id];
                                return(
                                    <li key={"listing" + i} className="item">
                                        <div className="item">
                                            <div className="itemImage">
                                                <Link to={"/listings/"+listing._id}>
                                                    <img src={listing.images[0]} alt="product"/>
                                                </Link>
                                            </div>
                                            
                                            <div className="itemName label">
                                                <Link to={"/listings/"+listing._id}>
                                                    {listing.title}
                                                </Link>
                                            </div>
                                            <div className="itemPrice label">${listing.price}</div>
                                            <div className="itemDate label">{listing.date}</div>
                                            <div className="itemUserCount label">{listing.user_list.length}</div>
                                            <div className="buttonSection">
                                                <div>
                                                    <a href={"/edit/"+listing._id} style={{color: "#1657fa"}}>
                                                        Edit    
                                                    </a>  
                                                </div>
                                            </div>
                                            <div className="buttonSection">
                                                <div style={{color: "#ff3d3d"}} onClick={()=>this.setState({removeListing: listing})}>
                                                    Delete    
                                                </div>  
                                            </div>
                                        </div>
                                        <hr style={{width:"100%"}}/>
                                    </li>
                                )
                            }
                            )}
                        </ul>
                        :
                        <div className="placeholderText">No listings yet</div>
                    }
                </div>
                <div className="footer">
                    <Link to="/makeListing">
                        <div>
                            <AddIcon style={{marginRight: "0.5rem"}}/>Create new listing
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}

export default ListingsScreen;