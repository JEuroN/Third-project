import { Component, OnInit } from '@angular/core';
import { usersService } from '../users.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { NotifiService } from '../notifi.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  value: boolean = true;
  config: any;
  public form = [
    {val: 'Men', isChecked: false, id: 0},
    {val: 'Women', isChecked: false, id: 1}
  ]
  checker:number = 1;
  mAge: number = 18;
  mxAge: number = 60;
  distance: number = 0;

  constructor(
    public users: usersService,
    public afs: AngularFirestore,
    public alert: AlertController,
    public notif: LocalNotifications,
    private not: NotifiService,
    public loadingController: LoadingController
  ) { }

  ngOnInit(){


    
  }

  
  ionViewDidLeave(){
    this.value = true;
    console.log('a')
    this.not.clear();
  }

  ionViewWillEnter(){
    let check = this.not.getData();
    if(check.length > 0){
      this.value = false;
          this.notif.schedule({
            id: Math.random(),
            text: 'You have a Match!'
          })
    }
  }


  setMin(e){
    this.mAge = e.target.value
  }

  setMax(e){
    this.mxAge = e.target.value;
  }

  setDist(e){
    this.distance = e.target.value;
  }

  setParam(){
    if(this.checker = 1){
      this.checker--;
    let flag = 0;
    for(let t=0; t<this.form.length; t++){
      if(this.form[t].isChecked == false)
      flag++;
    }
    if(flag >= this.form.length){
      this.showAlert('Error', 'Por favor, ingrese al menos un genero')
    }else{
      this.presentLoading();
      this.afs.doc(`matConfig/${this.users.getUID()}`).set({
        men: this.form[0].isChecked,
        women: this.form[1].isChecked,
        mAge: this.mAge,
        mxAge: this.mxAge,
        range: this.distance
      });
      console.log("Sucess");
      setTimeout(()=>{
        this.checker = 1;
      }, 2000);
    }
    }
  }

  async showAlert(header: string, message: string){
    const alert = await this.alert.create({
      header,
      message,
      buttons: ['Ok']
    })

    await alert.present()
  }


  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

}
