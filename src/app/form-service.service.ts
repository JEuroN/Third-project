import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  date: string = '';

  Amout = {
    timesLogged: 0,
    timesAnswered: 0
  }

  constructor(
    public afs: AngularFirestore
  ) { }

    //Metodo act la cantidad de logeadas al dia, de no existir, crea un doc con una loggeada

  setLogTime(){
    const date = new Date();
    const pipe = new DatePipe('en-US');
    this.date = pipe.transform(date, 'yy-MM-dd');
    try{
      const res = this.afs.doc(`charts/${this.date}`).snapshotChanges();
      const wes = res.subscribe((times: any) => {
        if(times.payload.data() == undefined){
          this.afs.doc(`charts/${this.date}`).set({
            timesLogged: 1,
            timesAnswered: 0,
            date: this.date
          })
        }else{
          this.Amout = {
            timesLogged: times.payload.data().timesLogged,
            timesAnswered: times.payload.data().timesAnswered,
          }
          this.upLog(this.date);
        }
        wes.unsubscribe();
      })
    }catch(err){
      console.log(err);
    }

  }

  //Lo de arriba pero con las respuestas
  setAnswerTime(){
    const date = new Date();
    const pipe = new DatePipe('en-US');
    this.date = pipe.transform(date, 'yy-MM-dd');
    try{
      const res = this.afs.doc(`charts/${this.date}`).snapshotChanges();
      const wes = res.subscribe((times: any) => {
        if(times.payload.data() == undefined){
          this.afs.doc(`charts/${this.date}`).set({
            timesLogged: 1,
            timesAnswered: 1,
            date: this.date
          })
        }else{
          this.Amout = {
            timesLogged: times.payload.data().timesLogged,
            timesAnswered: times.payload.data().timesAnswered
          }
          this.upAnswers(this.date);
        }
        wes.unsubscribe();
      })
    }catch(err){
      console.log(err);
    }

  }

  //Actualiza los docs
  upLog(doc: string){
    const time = this.afs.doc(`charts/${doc}`).set({
      timesLogged: this.Amout.timesLogged + 1,
      timesAnswered: this.Amout.timesAnswered,
      date: this.date
    });

  }

  upAnswers(doc: string){
    const time = this.afs.doc(`charts/${doc}`).set({
      timesLogged: this.Amout.timesLogged,
      timesAnswered: this.Amout.timesAnswered + 1,
      date: this.date
    });

  }
}
