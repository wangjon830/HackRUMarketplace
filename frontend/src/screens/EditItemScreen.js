import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

import User from '../web/User';
import Item from '../web/Item';
import '../styles/EditItemScreen.css';

class EditItemScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            item: null,
            updatedItem: null,
        }
    }

    updateValue(property, val){
        this.setState(prevState=>{
            var updatedItem = prevState.updatedItem;
            updatedItem[property] = val;
            return {updatedItem};
        })
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
                    var updatedItem = JSON.parse(JSON.stringify(prevState.updatedItem));
                    updatedItem.images = updatedItem.images.concat(e.target.result);
                    return {updatedItem}
                })
                resolve(reader.result);
            }
            reader.onerror = error => reject(error);
        });
    }

    removeImage(index){
        this.setState(prevState=>{
            var updatedItem = prevState.updatedItem;
            updatedItem.images = updatedItem.images.filter((image, i) => i !== index);

            return {updatedItem}
        })
        document.getElementById("imageInput").value = null; 
    }

    async reset(){
        this.setState(prevState => ({updatedItem: JSON.parse(JSON.stringify(prevState.item))}))
    }

    async saveChanges(){
        await User.editListing(this.state.updatedItem);
        this.props.history.push('/listings')
    }

    async componentDidMount(){
        let id = this.props.match.params.id;
        var item = (await Item.getItem(id)).item;
        if(!User.isUser(item.poster))
            this.props.history.push('/')

        this.setState({item, updatedItem: JSON.parse(JSON.stringify(item))})
    }

    render(){
        var categories = ["Textbook", "Appliances", "Housing", "Furniture", "Electronics"];
        var conditions = ["Brand new", "Like new", "Good", "Used"];
        return (
            <div id="editItemScreen">
                <div className="listingValue">
                    <label className="sectionLabel">Title</label>
                    <input 
                        className="inputContainer"
                        type='text' 
                        placeholder="Listing title" 
                        name="title"
                        style={{fontSize:"1.3rem"}}
                        value={this.state.updatedItem ? this.state.updatedItem.title : ""}
                        onChange={(e) => this.updateValue("title", e.target.value)}
                    />
                </div>

                <div className="listingValue">
                    <label className="sectionLabel">Description</label>
                    <textarea 
                        className="inputContainer"
                        placeholder="Description" 
                        name='description' 
                        rows={10}
                        style={{outline:"none", font: "400 1rem Arial", padding: "7px"}}
                        value={this.state.updatedItem ? this.state.updatedItem.description : ""}
                        onChange={(e) => this.updateValue("description", e.target.value)}
                    />
                </div>

                <div className="listingValue">
                    <label className="sectionLabel">Price</label>
                    <div className="inputContainer">
                        <div style={{display:'flex', alignItems:'center', margin: 0}}>
                            <label style={{fontSize:"1rem"}}>$</label>
                            <input 
                                type="number" 
                                style={{width: "80px"}}
                                name="price"
                                min="0" 
                                step="0.01" 
                                placeholder="e.g. 1.50" 
                                value={this.state.updatedItem ? this.state.updatedItem.price : ""}
                                onChange={(e) => {
                                    var input = e.target.value;
                                    if(input.includes('.') && input.length - input.indexOf('.') >= 4)
                                        return;

                                    this.updateValue("price", input)
                                }
                            }/>
                        </div>
                    </div>
                </div>

                <div className="listingValue">
                    <label className="sectionLabel">Category</label>
                    <div className="inputContainer">
                        {categories.map((category, i)=>
                            <div className="radioItem" key={"category" + i}>
                                <input 
                                    type="radio" 
                                    name="category" 
                                    value={category.toLowerCase()} 
                                    checked={this.state.updatedItem && this.state.updatedItem.category === category.toLowerCase()}
                                    onChange={(e) => {    
                                        this.updateValue("category", e.target.value);
                                    }}
                                />
                                <label>{category}</label>
                            </div>
                        )}
                    </div>
                </div>

                <div className="listingValue">
                    <label className="sectionLabel">Condition</label>
                    <div className="inputContainer">
                        {conditions.map((condition, i)=>
                            <div className="radioItem" key={"condition" + i}>
                                <input 
                                    type="radio" 
                                    name="condition" 
                                    value={condition.toLowerCase()} 
                                    checked={this.state.updatedItem && this.state.updatedItem.condition === condition.toLowerCase()}
                                    onChange={(e) => {    
                                        this.updateValue("condition", e.target.value);
                                    }}
                                />
                                <label>{condition}</label>
                            </div>
                        )}
                    </div>
                </div>

                <div className="listingValue" id="listingImages">
                    <label className="sectionLabel">Images</label>
                    <div className="inputContainer" style={{flexDirection:'column'}}>
                        <div className="imageSection">
                            {this.state.updatedItem && this.state.updatedItem.images.map((image_src, i)=>(
                                <div className="preview" key={"preview" + i}>
                                    <div className="imageOverlay" onClick={()=>this.removeImage(i)}>
                                        <CloseIcon style={{fontSize:"4rem"}}/>
                                    </div>
                                    <img src={image_src}/>
                                </div>
                            ))}
                        </div>
                        <input 
                            className="imageInput"
                            type="file" 
                            name="image" 
                            accept="image/*"
                            multiple="multiple" 
                            style={{marginTop: '1rem', outline:'none'}} 
                            onChange={(e)=>this.toBase64(e.target.files[0])}
                        />
                    </div>
                </div>

                <div className="buttonContainer">
                    <button className="resetBtn" onClick={()=>this.reset()}>
                        Reset
                    </button>
                    <button className="saveBtn" onClick={()=>this.saveChanges()}>
                        Save changes
                    </button>
                </div>
            </div>
        )
    }
}

export default EditItemScreen;
