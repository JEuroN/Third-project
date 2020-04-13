import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { usersService } from '../users.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  value: boolean = true;
  
  constructor(
    private afs: AngularFirestore,
    private user: usersService,
    private notif: LocalNotifications
  ) { }
  
  ngOnInit(){
    const upd = this.afs.doc(`match/${this.user.getUID()}`).snapshotChanges();
    upd.subscribe( N => {
      this.value = false;

      this.notif.schedule({
        id: Math.random(),
        text: 'New Match!'
      })
    })
    
    
  }

  ionViewDidLeave(){
    this.value = true;
    console.log('a')
  }
}
