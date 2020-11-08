import {extendObservable} from 'mobx';

class UserStore{
    constructor() {
        extendObservable(this, {
            loggedIn: false,
            firstName: '',
            lastName:'',
            email: '',
            profilePic: null
        })
    }
}

export default new UserStore();