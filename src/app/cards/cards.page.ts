import { Component, Renderer2, ViewChildren, QueryList, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { usersService } from '../users.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit{

  value: boolean = true;
  params: boolean = true;
  config: any;
  cards = [
    {
      si: 'algo',
      img: 'assets/img/people.jpg',
      des: 'alguito',
      age: '22'

    },
    {
      si: 'algo',
      img: 'assets/img/people.jpg',
      des: 'alguito',
      age: '23'
    }

  ];

  moveOutWidth: number;
  shiftReq: boolean;
  transOn: boolean;
  heartVis: boolean;
  crossVis: boolean;

  @Output() cho = new EventEmitter();
  @ViewChildren('tinderCards') tinderCards: QueryList<ElementRef>

  cardsArray: Array<ElementRef>

  constructor(
  private render: Renderer2,
  private user: usersService,
  private afs: AngularFirestore
  ) { }

   ngOnInit(){
    const upd = this.afs.doc(`matConfig/${this.user.getUID()}`).snapshotChanges();
    upd.subscribe( (n: any) => {
      this.config = n.payload.data();
    })
    
    
  }

  ionViewDidLeave(){
    this.value = true;
    console.log('a')
  }

  ionViewWillEnter(){
    if(this.config != undefined){

    }
  }

  ngAfterViewInit(): void {
    this.moveOutWidth = document.documentElement.clientWidth * 1.5;
    this.cardsArray = this.tinderCards.toArray();
    this.tinderCards.changes.subscribe(()=>{
      this.cardsArray = this.tinderCards.toArray();
    })
  }

  clickBtn(event, bool){
    event.preventDefault();
    if(!this.cards.length)
      return false;
    if(bool){
      this.cardsArray[0].nativeElement.style.transform = 'translate(' + this.moveOutWidth + 'px, -100px) rotate(-30deg)';
      this.toggle(false, true);

    } else {
      this.cardsArray[0].nativeElement.style.transform = 'translate(-' + this.moveOutWidth + 'px, -100px) rotate(30deg)';
      this.toggle(true, false);

    }
    this.shiftReq = true;
    this.transOn = true;
  }

  toggle(cross, heart){
    this.crossVis = cross;
    this.heartVis = heart;
  }

  handleShift(){
    this.transOn = false;
    this.toggle(false,false);
    if(this.shiftReq){
      this.shiftReq = false;
      this.cards.shift();
      console.log(this.cardsArray);
      console.log(this.cards);
    }
  }

  handlePick(event){
    if(event.deltaX === 0 || (event.center.x === 0 && event.center.y === 0) || !this.cards.length)
      return
    if(this.transOn){
      this.handleShift();
    }

    this.render.addClass(this.cardsArray[0].nativeElement, 'moving');

    if(event.deltaX > 0)
      this.toggle(true, false)
    if(event.deltaX < 0)
      this.toggle(false, true)

    let xM = event.deltaX * 0.03;
    let yM = event.deltaY / 80;
    let rotate = xM * yM;

    this.render.setStyle(this.cardsArray[0].nativeElement, 'transform', 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)');

    this.shiftReq = true;
  }

  handlePickEnd(event){
    this.toggle(false,false);
    if(!this.cards.length) 
      return;
    this.render.removeClass(this.cardsArray[0].nativeElement, 'moving');
    let keep = Math.abs(event.deltaX) < 100 || Math.abs(event.velocityX) < 0.5;
    if(keep){
      this.render.setStyle(this.cardsArray[0].nativeElement, 'transform', '');
      this.shiftReq = false;
    }else{
      let endX = Math.max(Math.abs(event.velocityX) * this.moveOutWidth, this.moveOutWidth);
      let toX = event.deltaX > 0 ? endX : -endX;
      let endY = Math.abs(event.velocityY) * this.moveOutWidth;
      let toY = event.deltaY > 0 ? endY : -endY;
      let xM = event.deltaX * 0.03;
      let yM = event.deltaY / 80;
      let rotate = xM * yM;

      this.render.setStyle(this.cardsArray[0].nativeElement, 'transform', 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)');

      this.shiftReq = true;

      this.choice(!!(event.deltaX>0), this.cards[0]);
     }
  }

  choice(a,b){
    this.cho.emit({
      choice: a,
      payload: b
    })
  }
}
