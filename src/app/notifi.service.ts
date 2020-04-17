import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { usersService } from './users.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifiService {

  config: any;
  cards = [];
  cross = [];
  heart = [];
  

  constructor(private afs: AngularFirestore,
    private user: usersService) { }

    //GetData() hace dos peticiones a la base de datos, la primera para obtener antiguos match del usuario, y la segunda para cargar los parametros que el usuario selecciono 
  getData(){
    const matches = this.afs.doc(`match/${this.user.getUID()}`).snapshotChanges();
    matches.subscribe((m: any) => {
      this.cross = m.payload.data().cross;
      this.heart = m.payload.data().heart;
    })


    const upd = this.afs.doc(`matConfig/${this.user.getUID()}`).snapshotChanges();
    upd.subscribe((n: any) => {
      this.config = n.payload.data();
      if(n != undefined){
        this.checkCards();
      }else
        return undefined;
    })
    return this.cards;

  }

//updateCross() y updateHeart() actualiza en una coleccion a aquellos usuarios a quienes se les ha dado like o dislike por el usuario de momento
  updateCross(id: string){
    console.log(id, 'blocked')
    this.afs.doc(`match/${this.user.getUID()}`).set({
      cross: [...this.cross, id],
      heart: [...this.heart]
    })
  }

  updateHeart(id: string){
    console.log(id, 'blocked')
    this.afs.doc(`match/${this.user.getUID()}`).set({
      cross: [...this.cross],
      heart: [...this.heart, id]
    })
  }

//CheckCards() luego de obtener los parametros de busqueda y cada vez que estos actualicen, se crean ods querys para buscar a los usuarios que aun no han sido encontrados
  checkCards(){
    console.log('init', this.config);
  
      if(this.config.men == true){
        const menCards = this.afs.collection('users', ref => {
          return ref.where('sex', '==', 'Hombre').where('age','>=', this.config.mAge).where('age','<=', this.config.mxAge)
        })

        //Uno para hombres y otro para mujeres
        const men = menCards.get();
        men.subscribe( (menData: any) => {
          menData.docs.forEach(male => {
            let aux = male.data();
            let img = null;

            //Si el usuario no tiene foto se le coloca una por defecto
            if(aux.img == undefined){
              img = 'assets/img/default-profile-picture1.jpg'
            }else{
              img = aux.img;
            }
            //Asi el usuario no se puede dar like o dislike a uno mismo, y no puede encontrarse con el mismo match dos veces
            if(male.id != this.user.getUID()){
              if(this.cross.includes(male.id) == false || this.heart.includes(male.id) == false){
                this.cards.push({
                  id: male.id,
                  age: aux.age,
                  name: aux.name,
                  des: aux.description,
                  img: img
                })
              }
            }
          })
        })
      }
      //El mismo proceso pero esta vez para mujeres
      if(this.config.women == true){
        const womenCards = this.afs.collection('users', ref => {
          return ref.where('sex', '==', 'Mujer').where('age','>=', this.config.mAge).where('age','<=', this.config.mxAge)
        })
        const men = womenCards.get();
        men.subscribe( (menData: any) => {
          menData.docs.forEach(female => {
            let fData = female.data();
            let fimg = null;
            if(fData.img == undefined){
              fimg = 'assets/img/default-profile-picture1.jpg'
            }else{
              fimg = fData.img;
            }
            if(female.id != this.user.getUID()){
              if(this.cross.includes(female.id) == false || this.heart.includes(female.id) == false){
              this.cards.push({
                id: female.id,
                age: fData.age,
                name: fData.name,
                des: fData.description,
                img: fimg
              })
            }
            }
          })
        })
      }

  }
  //Para evitar que se acumulen cartas repetidas, el limpia las cartas existentes cada vez que es llamado el metodo clear()
  clear(){
    this.cards = [];
  }


}
