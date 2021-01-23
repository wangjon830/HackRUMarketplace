import Cookies from 'js-cookie';
var bcrypt = require('bcryptjs');

const ACCESS_DURATION = new Date(new Date().getTime() + 30 * 60 * 1000);
const REFRESH_DURATION = 30;
export default class User {
    static isLoggedIn(){
        var user = JSON.parse(window.localStorage.getItem('user'));

        return user != null
    }

    // check if user id is same as logged in account
    static isUser(user_id){
        var user = JSON.parse(window.localStorage.getItem('user'));
        return user._id === user_id;
    }

    static getRefreshToken(){
        return Cookies.get('refresh');
    }

    static getAccessToken(){
        return Cookies.get('access');
    }

    static setAccessToken(token){
        Cookies.remove('access');
        Cookies.set('access', token, {expires: ACCESS_DURATION})
    }

    // check if access token valid and refresh if not
    static async checkAccess(user){
        var accessToken = Cookies.get('access');
        var refreshToken = Cookies.get('refresh')
        if(!accessToken){
            if(!refreshToken) {
                this.clearAccountInfo();
                return false;
            }
            else{
                await fetch('http://127.0.0.1:5000/refresh', {
                    method: 'post',
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        refresh_token: refreshToken,
                        user
                    })
                })
                .then(response => response.json())
                .then(data =>{
                    Cookies.set('access', data.access_token, {expires: ACCESS_DURATION})
                })
                return true;
            }
        }
        return true;
    }

    // check if password is correct
    static async verifyPassword(password){
        var user = JSON.parse(window.localStorage.getItem('user'));

        try{
            var response = await fetch('http://127.0.0.1:5000/login', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    password
                })
            })
            .then(response=>response.json())
            .then(data =>{
                if(data && data.success){
                    return true;
                }
                else{
                    return false;
                }
            })  
            return response;          
        }
        catch(e){
            console.log(e);
        }
    }

    static async login(email, password){
        try{
            var response = await fetch('http://127.0.0.1:5000/login', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            .then(response=>response.json())
            .then(data =>{
                if(data && data.success){
                    // values must be saved as string in LocalStorage
                    this.saveAccountInfo(data, data.access_token, data.refresh_token);
                    return {success: true}
                }
                else if(data && !data.success){
                    return {success: false, message: data.msg};
                }
                else{
                    return {success: false, message: "Could not login"};
                }
            })  
            return response;          
        }
        catch(e){
            console.log(e);
            // this.reset();
        }
    }

    static async register(newAccount){
        let hashedPassword = await bcrypt.hash(newAccount.password, 10)

        try{
            var response = await fetch('http://127.0.0.1:5000/register', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "firstName": newAccount.firstName,
                    "lastName": newAccount.lastName,
                    "email": newAccount.email,
                    "hashedPassword": hashedPassword
                })
            })
            .then(response => response.json())
            .then(data =>{
                if(data && data.success){
                    this.saveAccountInfo(data, data.access_token, data.refresh_token);
                    return {success: true}
                }
                else
                    return {success: false, message: data.msg};
            })      
            return response;      
        }
        catch(e){
            console.log(e);
            // this.reset();
            return;
        }
    }

    static async authenticateUser(user){
        try{
            var response = await fetch('http://127.0.0.1:5000/oauth', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                if(data && data.success){
                    // values must be saved as string in LocalStorage
                    this.saveAccountInfo(data, data.access_token, data.refresh_token);
                    return {success: true}
                }
                else 
                    return {success: false, message: data.msg};
            })   
            return response;         
        }
        catch(e){
            console.log(e);
        }
    }

    static async changePassword(newPassword){
        let hashedPassword = await bcrypt.hash(newPassword, 10)
        var response = await this.editUser({hashedPassword});
        return response;
    }

    static async getAccount(user_id){
        try{
            var response = await fetch('http://127.0.0.1:5000/getAccount', {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id: user_id
                })
            })
            .then(response=>response.json())
            .then(data => {
                if(data && data.success)
                    return {success: true, message: data.msg, user: data.user};
                else
                    return {success: false, message: data.msg};
            })
            return response;
        }
        catch(e){
            console.log(e);
            return;
        }
    }

    static async editUser(updatedUser){
        var user = JSON.parse(window.localStorage.getItem('user'));
        var body = {_id: user._id, user: updatedUser};

        var response = await this.protectedAction(body, 'editUser');
        return response;
    }

    static async markRead(){
        var user = JSON.parse(window.localStorage.getItem('user'));
        var body = {_id: user._id};

        var response = await this.protectedAction(body, 'markRead');
        return response;
    }

    static async getNotifications(){
        var user = JSON.parse(window.localStorage.getItem('user'));
        var body = {_id: user._id};

        var response = await this.protectedAction(body, 'getNotifications');
        return response;
    }

    static async removeNotification(notification_id){
        var body = {_id: notification_id};

        var response = await this.protectedAction(body, 'removeNotification');
        return response;
    }

    static async getUserList(item_id){
        var body = {item_id};

        var response = await this.protectedAction(body, 'getUserList');
        return response;
    }

    static async isInWatchlist(item_id){
        var user = JSON.parse(window.localStorage.getItem('user'));
        var body = { _id: user._id}

        var response = await this.protectedAction(body, 'getWatchlist');
        if(!response.success)
            return false;
        return item_id in response.watchlist;
    }

    static async getWatchlist(){
        var user = JSON.parse(window.localStorage.getItem('user'));
        var body = { _id: user._id}

        var response = await this.protectedAction(body, 'getWatchlist');
        return response;
    }

    static async getWatchlistData(){
        var user = JSON.parse(window.localStorage.getItem('user'));
        var body = { _id: user._id}

        var response = await this.protectedAction(body, 'getWatchlistData');
        return response;
    }

    static async addToWatchlist(item_id){
        var user = JSON.parse(window.localStorage.getItem('user'));
        var body = { user_id: user._id, item_id}

        var response = await this.protectedAction(body, 'addWatchlist');
        return response;
    }

    static async removeFromWatchlist(item_id,){
        var user = JSON.parse(window.localStorage.getItem('user'));
        var body = { user_id: user._id, item_id}

        var response = await this.protectedAction(body, 'removeWatchlist');
        return response;
    }

    static async getListingData(){
        var user = JSON.parse(window.localStorage.getItem('user'));
        var body = { _id: user._id}

        var response = await this.protectedAction(body, 'getListingData');
        return response;
    }

    static async postListing(item){
        var user = JSON.parse(window.localStorage.getItem('user'));
        var body = { user_id: user._id, item}

        var response = await this.protectedAction(body, 'addItem');
        return response;
    }

    static async deleteListing(item_id){
        var user = JSON.parse(window.localStorage.getItem('user'));
        var body = { user_id: user._id, item_id}

        var response = await this.protectedAction(body, 'deleteItem');
        return response;
    }

    static async editListing(new_item){
        var body = {new_item}

        var response = await this.protectedAction(body, 'editItem');
        return response;
    }

    static async protectedAction(body, route){
        var user = JSON.parse(window.localStorage.getItem('user'));

        // make sure access token is valid
        var hasAccess = await this.checkAccess(user)
        if(!hasAccess)
            return {success: false, message: "Tokens invalid"}

        try{
            var response = await fetch('http://127.0.0.1:5000/' + route, {
                method: 'post',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    Object.assign(body, {
                        refresh_token: Cookies.get('refresh'),
                        access_token: Cookies.get('access')
                    })
                )
            })
            .then(response => response.json())
            .then(async (data) => {
                // update LocalStorage if necessary
                if(data && data.success && data.user)
                    window.localStorage.setItem('user', JSON.stringify(data.user));
                // access token was invalid and server provided new access token
                else if(data.access_token){
                    this.setAccessToken(data.access_token)
                    // try again
                    return await this.protectedAction(body, route);
                }
                return data;
            })   
            return response;         
        }
        catch(e){
            console.log(e);
        }
    }

    static saveAccountInfo(accountJson, accessToken, refreshToken){
        window.localStorage.setItem('user', JSON.stringify(accountJson.user));
        Cookies.set('access', accessToken, {expires: ACCESS_DURATION});
        Cookies.set('refresh', refreshToken, {expires: REFRESH_DURATION});
    }

    static clearAccountInfo(){
        window.localStorage.clear();
        Cookies.remove('access');
        Cookies.remove('refresh');
    }
}