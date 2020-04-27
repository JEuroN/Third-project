import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { usersService } from '../users.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { NotifiService } from '../notifi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  value: boolean = true;
  
  constructor(
    private notif: LocalNotifications,
    private not: NotifiService,
    private router: Router
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

  select(id){
    
  }

}
