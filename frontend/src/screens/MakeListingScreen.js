import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

import User from '../web/User';
import '../styles/MakeListing.css';

class MakeListingScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            error: '',
            images: []
        }
    }

    // images stored as base64 on database
    toBase64(file){
        if(!file)
            return;
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                this.setState(prevState=>{
                    var images = prevState.images.concat(e.target.result);
                    return {images}
                })
                resolve(reader.result);
            }
            reader.onerror = error => reject(error);
        });
    }

    removeImage(index){
        this.setState(prevState=>{
            var images = prevState.images.filter((image, i) => i !== index);
            return {images}
        })
        document.getElementById("imageInput").value = null; 
    }

    async postListing(){
        let title = document.getElementById("name").value;
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
        var images = this.state.images;
        // console.log(name, description, price, trade, categories, condition, images);
        var item = {
            title,
            description,
            price,
            trade,
            categories,
            condition,
            images
        }

        await User.postListing(item)
        .then(response => {
            if(response.success)
                this.props.history.push('/settings/listings')
        });
    }

    render(){
        var categories = ["Textbook", "Appliances", "Housing", "Furniture", "Electronics"];
        var conditions = ["Brand new", "Like new", "Good", "Used"];
        return( 
            <div id="newListingScreen">
                <div >
                    <div className = "listingHead"><h1>Make New Listing<hr/></h1></div>
                    <form className="listingForm" action="">
                        <div className="listingValue">
                            <label className="sectionLabel">Title:</label>
                            <input 
                                className="inputContainer"
                                type='text' 
                                placeholder="Listing title" 
                                name="title"
                            />
                        </div>

                        <div className="listingValue">
                            <label className="sectionLabel">Description: </label>
                            <textarea 
                                className="inputContainer"
                                placeholder="Description" 
                                name='description' 
                                rows={5}
                            />
                        </div>

                        <div className="listingValue">
                            <label className="sectionLabel">Price:</label>
                            <label style={{marginLeft:"1rem"}}>$</label>
                            <input 
                                className="inputContainer"
                                type="number" 
                                style={{margin: 0, width: "160px"}}
                                name="price"
                                min="0" 
                                step="0.01" 
                                placeholder="e.g. 1.50" 
                                onChange={(e) => {
                                    var input = e.target.value;
                                    if(input.includes('.') && input.length - input.indexOf('.') >= 4)
                                        e.target.value = input.substring(0, input.length - 1);
                                }
                            }/>
                        </div>

                        <div style={{display:"flex"}}>
                            <div className="listingValue">
                                <label className="sectionLabel">Category:</label>
                                <div className="inputContainer">
                                    {categories.map((category, i)=>
                                        <div className="radioItem" key={"category" + i}>
                                            <input 
                                                type="radio" 
                                                name="category" 
                                                value={category.toLowerCase()} 
                                            />
                                            <label>{category}</label>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="listingValue" style={{marginLeft:"5rem"}}>
                                <label className="sectionLabel">Condition:</label>
                                <div className="inputContainer">
                                    {conditions.map((condition, i)=>
                                        <div className="radioItem" key={"condition" + i}>
                                            <input 
                                                type="radio" 
                                                name="condition" 
                                                value={condition.toLowerCase()} 
                                            />
                                            <label>{condition}</label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="listingValue" id="listingImages">
                            <label className="sectionLabel">Images: </label>
                            <div className="inputContainer" style={{flexDirection:'column'}}>
                                <div className="imageSection">
                                    {this.state.images.map((image_src, i)=>(
                                        <div className="preview" key={"preview" + i}>
                                            <div className="imageOverlay" onClick={()=>this.removeImage(i)}>
                                                <CloseIcon style={{fontSize:"4rem"}}/>
                                            </div>
                                            <img src={image_src}/>
                                        </div>
                                    ))}
                                </div>
                                <input 
                                    id="imageInput"
                                    type="file" 
                                    name="image" 
                                    accept="image/*"
                                    multiple="multiple" 
                                    style={{marginTop: '1rem', outline:'none'}} 
                                    onChange={(e)=>{
                                        this.toBase64(e.target.files[0])
                                    }}
                                />
                            </div>
                            
                        </div>
                          
                        <div className="buttonContainer">
                            <button type="button" className="submitBtn" onClick={()=>this.postListing()}>Submit</button>
                        </div>
                        <div className="errorMessage" id="listingErrorMessage" style={{display: this.state.error.length > 0 ? "block" : "none"}}>
                            {this.state.error}
                        </div>
                    </form>
                </div>
            </div>      
        )
    }
}

export default MakeListingScreen;