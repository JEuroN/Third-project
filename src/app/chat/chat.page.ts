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
  chats = [
    
  ]
 
  
  constructor(
    private notif: LocalNotifications,
    private not: NotifiService,
    private router: Router,
    private user: usersService,
    private afs: AngularFirestore
  ) { }

  ngOnInit(){

  }
  
  ionViewDidLeave(){
    this.value = true;
    console.log('a')
    this.not.clear();
  }

  async ionViewWillEnter(){
    this.chats = [];
    let check = this.not.getData();
    if(check.length > 0){
      this.value = false;
      this.notif.schedule({
        id: Math.random(),
        text: 'You have a Match!'
      })
    }


    const seeChats = await this.afs.doc(`chat/${this.user.getUID()}`).snapshotChanges();
    seeChats.subscribe( (cChats: any) =>{
      
      const chatEntries = cChats.payload.data().chats;
      console.log(chatEntries);
      chatEntries.forEach(entry => {
        console.log(entry);
        
        this.chats.push({
          cId: entry.cId,
          cName: entry.name
        })
      });
    })

   

    
  }




  select(id, name){
    this.router.navigate(['chats', {cId: id, cName: name}])
  }

}
