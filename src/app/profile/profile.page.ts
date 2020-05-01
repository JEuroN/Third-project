import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore'
import { usersService } from '../users.service';
import { AlertController } from '@ionic/angular';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { NotifiService } from '../notifi.service';
import { LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';



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
    latitud: number = null;
    longitud: number = null;

    value: boolean = true;

  constructor(
    public users: usersService,
    public alert: AlertController,
    public afs: AngularFirestore,
    public router: Router,
    public notif: LocalNotifications,
    public camera: Camera,
    public not: NotifiService,
    public loadingController: LoadingController,
    public geo: Geolocation
    ) { }

  ngOnInit() {
    const data = this.afs.collection('users').doc(this.users.getUID()).snapshotChanges();
    data.subscribe((deta: any) =>{
      let nDeta = deta.payload.data();
      console.log(deta.payload.data().coord.lat, nDeta.coord);
      this.name = nDeta.name;
      this.age = nDeta.age;
      this.sex = nDeta.sex ? ('Masculino') : ('Femenino');
      this.description = nDeta.description;
      this.like[0].cont = nDeta.like1;
      this.like[1].cont = nDeta.like2;
      this.like[2].cont = nDeta.like3;
      this.dislike[0].cont = nDeta.dislike1;
      this.dislike[1].cont = nDeta.dislike2;
      this.dislike[2].cont = nDeta.dislike3;
      if(nDeta.coord == undefined){
        console.log('No coord')
      }else{
        console.log(nDeta.coord.lat)
          this.latitud = nDeta.coord.lat;
          this.longitud = nDeta.coord.lon;
      }
      if(nDeta.img != undefined || nDeta.img != null){
        this.img = nDeta.img;
      }else{
        this.img = 'assets/img/default-profile-picture1.jpg'
      }
    })

  }
  
  ionViewWillEnter(){
    this.change();
    let check = this.not.getData();
    if(check.length > 0){
      this.value = false;
          this.notif.schedule({
            id: Math.random(),
            text: 'You have a Match!'
          })
    }
  }

  
  ionViewDidLeave(){
    this.value = true;
    console.log('a')
    this.not.clear();
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
    
  async edit(){
    //Hace el edit de los datos del user
    if(this.name == '')
      this.showAlert('Error!', 'Wrong name');
    else if(Number.isInteger(this.age) != true){
      this.showAlert('Error!', 'Bad format for age')
    }else if(this.age > 60 || this.age < 18){
      this.showAlert('Error!','Age range is 18-60');
    }else{
      this.presentLoading();
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
        dislike3: this.dislike[2].cont,
        img: this.img,
        coord: {lat: this.latitud, lon: this.longitud}
      }
  
      await this.afs.collection('users').doc(this.users.getUID()).set(newData);
      console.log("Sucess");
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
      allowEdit: true,
      targetHeight: 300,
      targetWidth: 300
    }
    this.camera.getPicture(options)
    .then(async (imageData) => {
      this.presentLoading();
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.img = base64Image;
      await this.afs.doc(`users/${this.users.getUID()}`).set({
        name: this.name,
        age: this.age,
        sex: this.sex,
        description: this.description,
        like1: this.like[0].cont,
        like2: this.like[1].cont,
        like3: this.like[2].cont,
        dislike1: this.dislike[0].cont,
        dislike2: this.dislike[1].cont,
        dislike3: this.dislike[2].cont,
        img: this.img,
        coord: {lat: this.latitud, lon: this.longitud}
      });
      console.log("Sucess");
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
      allowEdit: true,
      targetHeight: 300,
      targetWidth: 300
    }
    this.camera.getPicture(options)
    .then(async (imageData) => {
      this.presentLoading();
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.img = base64Image;
      await this.afs.doc(`users/${this.users.getUID()}`).set({
          name: this.name,
          age: this.age,
          sex: this.sex,
          description: this.description,
          like1: this.like[0].cont,
          like2: this.like[1].cont,
          like3: this.like[2].cont,
          dislike1: this.dislike[0].cont,
          dislike2: this.dislike[1].cont,
          dislike3: this.dislike[2].cont,
          img: this.img,
          coord: {lat: this.latitud, lon: this.longitud}
      });
      console.log("Sucess");
    }, (err) => {
      console.log(err);
    });
  }
  
  erase(e){
    e.target.value = '';
  }

  logout(){
    this.router.navigate(['home']);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
  }

  locale(){
    let Geo = this.geo.getCurrentPosition()
    Geo.then((res) =>{
      this.latitud = res.coords.latitude
      this.longitud = res.coords.longitude

      this.afs.doc(`users/${this.users.getUID()}`).set({
          name: this.name,
          age: this.age,
          sex: this.sex,
          description: this.description,
          like1: this.like[0].cont,
          like2: this.like[1].cont,
          like3: this.like[2].cont,
          dislike1: this.dislike[0].cont,
          dislike2: this.dislike[1].cont,
          dislike3: this.dislike[2].cont,
          img: this.img,
          coord: {lat: this.latitud, lon: this.longitud}
      })

      console.log("Coord success!");
    }).catch((error)=>{
      console.log(error);
      this.showAlert("Error!", 'There was a problem')
    })
  }

}

