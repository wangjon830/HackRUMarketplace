import {extendObservable} from 'mobx';

class UserStore{
    constructor() {
        extendObservable(this, {
            loading: true,
            isLoggedIn: false,
            username: ''
        })
    }
}

export default UserStore;