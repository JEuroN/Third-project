import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { usersService } from '../users.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore,
    private user: usersService
  ) { }

  ngOnInit(){

  }

  ionViewWillEnter() {
    this.route.params.subscribe(params =>{
      let param = params['msg'];
      let newChat: string = param.cId.substring(0,5) + this.user.getUID().substring(0,5);
      this.cId = newChat;
      this.username = param.cName
    })
    
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

  send(){
    this.msgs.push({
      name: this.user.getUID(),
      cont: this.sendMsg
    })
    this.afs.doc(`chats/${this.cId}`).set({
      msg: [...this.msgs]
    })
    this.sendMsg = '';
  }
  
}
