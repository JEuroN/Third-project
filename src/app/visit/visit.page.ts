import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.page.html',
  styleUrls: ['./visit.page.scss'],
})
export class VisitPage implements OnInit {


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

  value: boolean = true;
  visitId: string = null;

constructor(
  public alert: AlertController,
  public afs: AngularFirestore,
  public router: Router,
  public route: ActivatedRoute
  ) { }

ngOnInit() {

  this.route.params.subscribe(params => {
    this.visitId = params['msg']
  })


  const data = this.afs.collection('users').doc(this.visitId).snapshotChanges();
  data.subscribe((deta: any) =>{
    let nDeta = deta.payload.data();
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
    if(nDeta.img != undefined){
      this.img = nDeta.img;
    }else{
      this.img = 'assets/img/default-profile-picture1.jpg'
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
  
//Alerts
async showAlert(header: string, message: string){
  const alert = await this.alert.create({
    header,
    message,
    buttons: ['Ok']
  })

  await alert.present()
}
}
