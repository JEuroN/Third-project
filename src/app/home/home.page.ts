import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular'
import { usersService } from '../users.service'
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string = '';
  password: string = '';
  error: string = 'Ingrese sus datos';
  ola: any;
  img: any = 'assets/img/people.jpg'

  constructor(
    public afauth: AngularFireAuth,
    public router: Router,
    public alert: AlertController,
    public users: usersService,
    public afs: AngularFirestore,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  ionViewDidEnter(){
    this.users.flush();
  }

//Verifica que todos los campos tengan value, de tenerlo, te logea
  async login(){
    console.log(this.username, this.password);
    if(this.username == ''){
      this.showAlert('Error','Please use a valid email');
    }else if(this.password == ''){
      this.showAlert('Error','Please use a valid password');
    }else{try{
      const res = await this.afauth.auth.signInWithEmailAndPassword(this.username, this.password);
      this.users.setUser({
        user: this.username,
        uid : res.user.uid
      })
        this.router.navigate(['cards']);

      
    } catch(err) {
      console.log(err);
      this.showAlert('Error','Wrong username or password');
    }}

  }

  async showAlert(header: string, message: string){
    const alert = await this.alert.create({
      header,
      message,
      buttons: ['Ok']
    })

    await alert.present()
  }

}
