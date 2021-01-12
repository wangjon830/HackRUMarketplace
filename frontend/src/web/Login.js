import Cookies from 'js-cookie';
var bcrypt = require('bcryptjs');

const ACCESS_DURATION = new Date(new Date().getTime() + 30 * 60 * 1000);
const REFRESH_DURATION = 30;
export default class Login {
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
                    this.saveAccountInfo(JSON.stringify(data.user), data.access_token, data.refresh_token);
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
                    this.saveAccountInfo(JSON.stringify(data.user), data.access_token, data.refresh_token);
                    return {success: true}
                }
                else if(data && !data.success){
                    return {success: false, message: "An account already exists for this email"};
                }
                else{
                    return {success: false, message: "Account could not be created"};
                }
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
                    this.saveAccountInfo(JSON.stringify(data.user), data.access_token, data.refresh_token);
                    return {success: true}
                }
                else if(data && !data.success){
                    return {success: false, message: data.msg};
                }
                else{
                    return {success: false, message: "Could not authenticate"}
                }
            })   
            return response;         
        }
        catch(e){
            console.log(e);
        }
    }

    static saveAccountInfo(accountJson, accessToken, refreshToken){
        window.localStorage.setItem('user', accountJson);
        Cookies.set('access', accessToken, {expires: ACCESS_DURATION});
        Cookies.set('refresh', refreshToken, {expires: REFRESH_DURATION});
    }

    static clearAccountInfo(){
        window.localStorage.clear();
        Cookies.remove('access');
        Cookies.remove('refresh');
    }
}