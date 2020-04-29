import { Injectable } from '@angular/core';

interface user{
    user: string,
    uid: string
}

@Injectable()
export class usersService{
    private user: user;

    constructor(){}
//Guarda el uid de firebase para buscar lueog el usuario
    setUser(user: user){
        this.user = user;
    }

    getUser(){
        return this.user.user;
    }

    getUID(){
        return this.user.uid;
    }

    flush(){
        this.setUser({
            user: '',
            uid: ''
        })
    }
}