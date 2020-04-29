import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { usersService } from './users.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotifiService {

  config: any;
  cards = [];
  cross = [];
  heart = [];
  getHearts;

  

  constructor(private afs: AngularFirestore,
    private user: usersService,
    private router: Router, 
    private loadingController: LoadingController) { }

    //GetData() hace dos peticiones a la base de datos, la primera para obtener antiguos match del usuario, y la segunda para cargar los parametros que el usuario selecciono 
  getData(){
    this.cross = [];
    this.heart = [];
    let matches = this.afs.doc(`match/${this.user.getUID()}`).snapshotChanges();
    matches.subscribe((m: any) => {
      this.cross = m.payload.data().cross;
      this.heart = m.payload.data().heart;
      
    })
    
    this.config = [];
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
  async updateCross(id: string){
    console.log(id, 'blocked')
    await this.afs.doc(`match/${this.user.getUID()}`).set({
      cross: [...this.cross, id],
      heart: [...this.heart]
    })
    console.log('Crossed')
  }

 async updateHeart(id: string, cName: string){
    console.log(id, 'hearted', this.user.getUID())
    await this.afs.doc(`match/${this.user.getUID()}`).set({
      cross: [...this.cross],
      heart: [...this.heart, id]
    })
    console.log("Saved")
    this.getHearts = this.afs.collection('match').doc(id).valueChanges();
    this.getHearts.subscribe(async (hData: any) =>{
      if(hData != undefined && hData.heart.includes(this.user.getUID())){
      console.log("id hearts", id, this.user.getUID());
      console.log(hData);
      let oldChats = await this.getOldChats(this.user.getUID());
      let otherChats = await this.getOldChats(id);
      let sortArray = id.substring(0,5) + this.user.getUID().substring(0,5);
      sortArray = this.sort(sortArray);
      let newChat: string = sortArray;
      console.log(newChat);

      await this.setNewChats(this.user.getUID(), id, oldChats, cName);
      await this.setNewChats(id, this.user.getUID(), otherChats, this.user.getUser());
     
      console.log('We did it')
      await this.afs.doc(`chats/${newChat}`).set({
        msg:[]
      })
        
        this.router.navigate(['/chats', {cId: id, name: cName }]);
      }
    
    })
  }

  sort(text) {
    return text.split('').sort().join('');
  };

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
            if(fData.img == undefined || fData.img == ''){
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

  getOldChats(uid){
    let oldChats;
    this.afs.doc(`chat/${uid}`).snapshotChanges().subscribe((existentChats: any) =>{
      oldChats = existentChats.payload.data().chats
    })

    return oldChats;
    }

    async setNewChats(id,oid, oldChats, cName){
      console.log(id, oldChats, cName)
      if(oldChats != undefined){
        await this.afs.doc(`chat/${id}`).set({
        chats: [...oldChats, {cId: oid, 
        name: cName}]
      })
      }else(
        await this.afs.doc(`chat/${id}`).set({
          chats: [{cId: oid, 
          name: cName}]
        })
      )
    }

}
