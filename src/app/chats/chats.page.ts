import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { usersService } from '../users.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  cId: string;
  msgs = [];
  sendMsg: string = '';
  username: string = 'XxX_TuTatuaditox_XxX'
  param: any;
  passId: string;
  ownName=this.user.getUser();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore,
    private user: usersService,
    private camera: Camera,
    private loadingController: LoadingController
  ) { }

  ngOnInit(){

  }

  ionViewWillEnter() {
    this.msgs = [];
      this.route.params.subscribe(params =>{
      this.username = params.cName;
      this.param = params;
      this.getMsgs(this.param)
      this.passId = params.cId;
      console.log(params.cId, this.user.getUID())
    })

  }

  sort(text) {
    return text.split('').sort().join('');
  };

  async getMsgs(params){
    console.log(params);
    let sortArray = params.cId + this.user.getUID();
    console.log('sort', sortArray)
    sortArray = this.sort(sortArray);
    let newChat: string = sortArray.substring(0,10);
    console.log(newChat);
    this.cId = newChat;


    if(this.cId != undefined){
      const chat = this.afs.doc(`chats/${this.cId}`).snapshotChanges();
      chat.subscribe((msg: any) => {     
      this.msgs = msg.payload.data().msg;
    })
    }
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

  async send(){
    if(this.sendMsg == '' || this.sendMsg == null)
    return null
    else{
      this.msgs.push({
        name: this.user.getUser(),
        cont: this.sendMsg,
        type: true
      })
      await this.afs.doc(`chats/${this.cId}`).set({
        msg: [...this.msgs]
      })
      console.log('First send');

      await this.afs.doc(`chats/${this.user.getUID()}`).set({
        msg: [...this.msgs]
      })
      console.log("Second send")
      this.sendMsg = '';
      }
  
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
      this.msgs.push({
        name: this.user.getUser(),
        cont: base64Image,
        type: false
      })
      await this.afs.doc(`chats/${this.cId}`).set({
        msg: [...this.msgs]
      })
      console.log('First send');
      
      await this.afs.doc(`chats/${this.user.getUID()}`).set({
        msg: [...this.msgs]
      })
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
      this.msgs.push({
        name: this.user.getUser(),
        cont: base64Image,
        type: false
      })
      await this.afs.doc(`chats/${this.cId}`).set({
        msg: [...this.msgs]
      })
      console.log('First send');
      
      await this.afs.doc(`chats/${this.user.getUID()}`).set({
        msg: [...this.msgs]
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

  visit(){
    this.router.navigate(['visit', {msg: this.passId}]);
  }

}
