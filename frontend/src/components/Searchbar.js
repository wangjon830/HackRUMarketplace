import React from 'react';
import SearchIcon from '@material-ui/icons/Search';

import '../styles/Searchbar.css';

function Searchbar(props){
    return (
        <div className="searchSection">
            <form action="/search" method="GET">
                <input id="searchBar" className="searchBar" type="text" placeholder="Search..." name="q"/>
                <button className="searchButton" type="submit"><SearchIcon/></button>
            </form>
        </div>
    )
}

export default Searchbar;