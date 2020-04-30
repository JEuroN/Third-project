import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { NotifiService } from '../notifi.service';
import { usersService } from '../users.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-states',
  templateUrl: './states.page.html',
  styleUrls: ['./states.page.scss'],
})
export class StatesPage implements OnInit {

  value: boolean = true;
  follows = []
  states = [];
  sendMsg:string = null;
  myStates = [];

  constructor(
    public notif: LocalNotifications,
    public not: NotifiService,
    public user: usersService,
    public afs: AngularFirestore,
    public camera: Camera,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter(){ 
    this.states = [];
    let check = this.not.getData();
    if(check.length > 0){
      this.value = false;
          this.notif.schedule({
            id: Math.random(),
            text: 'You have a Match!'
          })
    }

    const follower = this.afs.doc(`follow/${this.user.getUID()}`).snapshotChanges();
    follower.subscribe((follows: any) =>{
      this.follows = follows.payload.data().follows;
      console.log(this.follows);
      this.getStates(this.follows);

      
    })

    this.afs.doc(`state/${this.user.getUID()}`).snapshotChanges().subscribe((state: any) =>{
      if(state != undefined){
        console.log(state.payload.data().states)
        this.myStates = [...state.payload.data().states];
        this.states = [...this.states, ...state.payload.data().states];      
        
      }
    })
  }

  async send(){
    if(this.sendMsg == '' || this.sendMsg == null)
      return null;
    else{
      this.myStates.push({
      name: this.user.getUser(),
      cont: this.sendMsg,
      type: true
      })
      
      await this.afs.doc(`state/${this.user.getUID()}`).set({
        states: [...this.myStates]
      })
      console.log("Second send")
      this.sendMsg = '';
    }
  }
  
  getStates(uid){
    uid.forEach((id)=>{
      let state = this.afs.doc(`state/${id}`).snapshotChanges()
      state.subscribe((states: any) =>{
      console.log(states.payload.data());
      this.states = [...this.states,...states.payload.data().states]
      })
    })
    console.log("America fuck yea!")
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
      this.myStates.push({
        name: this.user.getUser(),
        cont: base64Image,
        type: false
      })
      await this.afs.doc(`state/${this.user.getUID()}`).set({
        states: [...this.myStates]
      })
      console.log('First send');
      
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
      this.myStates.push({
        name: this.user.getUser(),
        cont: base64Image,
        type: false
      })
      
      await this.afs.doc(`state/${this.user.getUID()}`).set({
        states: [...this.myStates]
      })
      console.log("Sucess");
    }, (err) => {
      console.log(err);
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
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
}
