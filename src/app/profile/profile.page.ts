import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore'
import { usersService } from '../users.service';
import { AlertController } from '@ionic/angular';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {

    img: string = null;
    name: string = null;
    age: number = null;
    sex: string = null;
    description: string = null;
    like = [
      {cont: ''},
      {cont: ''},
      {cont: ''}
    ]
    dislike = [
      {cont: ''},
      {cont: ''},
      {cont: ''}
    ]

  constructor(
    public users: usersService,
    public afs: AngularFirestore,
    public alert: AlertController,
    public router: Router,
    public camera: Camera
    ) { }

  ngOnInit() {
    const data = this.afs.collection('users').doc(this.users.getUID()).snapshotChanges();
    data.subscribe((deta: any) =>{
      console.log(deta.payload.data());
      this.name = deta.payload.data().name;
      this.age = deta.payload.data().age;
      this.sex = deta.payload.data().sex ? ('Masculino') : ('Femenino');
      this.description = deta.payload.data().description;
      this.like[0].cont = deta.payload.data().like1;
      this.like[1].cont = deta.payload.data().like2;
      this.like[2].cont = deta.payload.data().like3;
      this.dislike[0].cont = deta.payload.data().dislike1;
      this.dislike[1].cont = deta.payload.data().dislike2;
      this.dislike[2].cont = deta.payload.data().dislike3;
    })

    const pic = this.afs.collection('Pics').doc(this.users.getUID()).snapshotChanges();
    pic.subscribe((dita:any) => {
      console.log(dita.payload.data())
      if(dita.payload.data().propic != undefined){
        this.img = dita.payload.data().propic;
      }
    })
  }
  
  ionViewWillEnter(){
    this.change();
  }

  change(){

    var text = document.getElementsByTagName('textarea')[0];
    text.style.minHeight = '0';
    text.style.height = '0';
    var scroll = text.scrollHeight;
    if(scroll > 96){
      scroll > 96
    }
    var area = document.getElementById('texta');
    area.style.height = scroll + 'px';
    text.style.minHeight = scroll + 'px';
    text.style.height = scroll + 'px';
  }
    
  edit(){
    //Hace el edit de los datos del user
    if(this.name == '' || this.age <= 12 || Number.isInteger(this.age) != true){
      this.showAlert('Error!', 'Wrong data');
    }else{
      const newData = {
        name: this.name,
        age: this.age,
        sex: this.sex,
        description: this.description,
        like1: this.like[0].cont,
        like2: this.like[1].cont,
        like3: this.like[2].cont,
        dislike1: this.dislike[0].cont,
        dislike2: this.dislike[1].cont,
        dislike3: this.dislike[2].cont
      }
  
      this.afs.collection('users').doc(this.users.getUID()).set(newData);
    }
  }

  //Alerts
  async showAlert(header: string, message: string){
    const alert = await this.alert.create({
      header,
      message,
      buttons: ['Ok']
    })

    await alert.present()
  }

  selectImg(){
    let options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 300,
      targetWidth: 300
    }
    this.camera.getPicture(options)
    .then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.img = base64Image;
      this.afs.doc(`Pics/${this.users.getUID()}`).set({
        propic: this.img
      });
    }, (err) => {
      console.log(err);
    });
  }

 
  takeImg() {
    let options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 300,
      targetWidth: 300
    }
    this.camera.getPicture(options)
    .then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.img = base64Image;
      this.afs.doc(`Pics/${this.users.getUID()}`).set({
        propic: this.img
      });
    }, (err) => {
      console.log(err);
    });
  }
  
  logout(){
    this.router.navigate(['home']);
  }
}

