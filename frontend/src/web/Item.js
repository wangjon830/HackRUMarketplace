export default class Item {
    // search database for keyword
    static async search(query){
        var response = await fetch('http://127.0.0.1:5000/search' + query, {
            method: 'get',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then(response => (response.json()))
        return response;
    }

    // get specific item from database
    static async getItem(id){
        var response = await fetch('http://127.0.0.1:5000/getItem?id=' + id, {
            method: 'get',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then(response => (response.json()))
        return response;
    }
}