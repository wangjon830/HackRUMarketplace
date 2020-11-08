import React,{useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';

function MakeListingScreen(props){
    const[error, setError] = useState('');
    const history = useHistory();

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const postListing = async()=>{
        let name = document.getElementById("name").value;
        let description = document.getElementById("description").value;
        let price = document.getElementById("price").value;
        let trade = document.getElementById("trade").value === "on" ? true : false;
        let categories = [];
        if(document.getElementById("textbook").checked)
            categories.push("textbooks");
        if(document.getElementById("appliance").checked)
            categories.push("appliance");
        if(document.getElementById("housing").checked)
            categories.push("housing");
        if(document.getElementById("furniture").checked)
            categories.push("furniture");
        if(document.getElementById("electronics").checked)
            categories.push("electronics");
        let condition = document.getElementById("condition").value;
        var images = new Array();
        let imageInput = document.getElementById("images");
        if (imageInput.files) {
            for(let i = 0; i < imageInput.files.length; i++){
                images.push(await toBase64(imageInput.files[i]))
            }
        }
        // console.log(name, description, price, trade, categories, condition, images);

        try{
            let res = await fetch('http://127.0.0.1:5000/addItem', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    description,
                    price,
                    trade,
                    categories,
                    condition,
                    images
                })
            })
    
            let result = await res.json();
    
            if(result && result.success){
                console.log("Item posted");
                history.push("/listings/" + result.id)
            }
            else{
                setError("Listing could not be posted");
                return;
            }
        }
        catch(e){
            console.log(e);
            return;
        }
    }

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
                        <option value="Heavily used">Heavily used</option>
                        <option value="Slightly used">Slightly used</option>
                        <option value="Brand new">Brand new</option>
                      </select>
                  </div>
                  <div className="listingValue" id="listingImages">
                      <sectionHead><label for="">Images</label></sectionHead><br/>
                      <img id="preview" style={{height:"20rem"}}/>
                      <input id="images" type="file" name="filefield" multiple="multiple"/>
                  </div>
                  <br/><br/>
                  <button type="button" className="buttonDark" onClick={postListing}>Submit</button>
                </form>
                <div className="errorMessage" id="listingErrorMessage" style={{display: error.length > 0 ? "block" : "none"}}>
                    {error}
                </div>
            </div>
        </div>
    </div>
        
    )
}

export default MakeListingScreen;