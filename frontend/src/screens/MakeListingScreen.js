import React,{useState} from 'react';
import AccountSidebar from "../components/AccountSidebar";
import {Link} from 'react-router-dom';
import data from '../data';

function MakeListingScreen(props){
    return( 
    <div className = "listing">
        <div >
            <div className = "listingHead"><h1>Make New Listing<hr/></h1></div>
            <div className="listingForm">
                <form action="" className="">
                  <div className="listingValue">
                      <sectionHead><label for="">Product Name</label></sectionHead><br/>
                      <input type="text" id="name" name="" className="wideInput" placeholder="Product Name.."/><br/>
                  </div>
                  <div className="listingValue">
                      <sectionHead><label for="">Description</label><br/></sectionHead>
                      <textarea id="description" className="wideInput" name="Text1" cols="40" rows="8"  placeholder="Product Description.."></textarea><br/>
                  </div>
                  <div className="listingValue" style={{fontSize:"25px"}}>
                      <sectionHead><label for="">Asking Price</label></sectionHead><br/>
                      $ <input id="price" className="narrowInput" type="number" min="0" step="any" placeholder="e.g. 1.50" /><br/>
                  </div>
                  <div className="listingValue">
                      <label for="">Willing to trade for other goods? </label>
                      <input id="trade" className="checkBox" type="checkbox"/>
                      <span className="checkmark"></span>
                  </div>
                  <div className="listingValue">
                      <sectionHead><label for="">Tags:</label></sectionHead><br/>
                      <label for="">Textbook</label>
                      <input id="textbook" type="checkbox"/><br/>
                      <label for="">Appliances</label>
                      <input id="appliance" type="checkbox"/><br/>
                      <label for="">Housing </label>
                      <input id="housing" type="checkbox"/><br/>
                      <label for="">Furniture</label>
                      <input id="furniture" type="checkbox"/><br/>
                      <label for="">Electronics</label>
                      <input id="electronics" type="checkbox"/><br/>
                      <label for="">Other: </label>
                      <input id="tags" className="mediumInput" type="text" placeholder="Tags separated by commas"/><br/>
                  </div>
                  <div className="listingValue">
                      <sectionHead><label for="">Condition</label></sectionHead><br/>
                      <select id="condition" className="mediumInput" name="">
                        <option value="">Heavily Used</option>
                        <option value="">Slightly Used</option>
                        <option value="">Brand New</option>
                      </select>
                  </div>
                  <div className="listingValue" id="listingImages">
                      <sectionHead><label for="">Images</label></sectionHead><br/>
                      <input id="images" type="file" name="filefield" multiple="multiple"/>
                  </div>
                  <br/><br/>
                  <input type="submit" className="buttonDark" value="Submit"/>
                </form>
            </div>
        </div>
    </div>
        
    )
}

export default MakeListingScreen;