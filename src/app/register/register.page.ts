import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  username: string = '';
  password: string = '';
  cpassword: string = '';
  age: number;
  error: string = 'Ingrese sus datos';

  public form = [
    {val: 'Hombre', isChecked: false, id: 0},
    {val: 'Mujer', isChecked: false, id: 1}
  ]
  constructor(
    public afauth: AngularFireAuth,
    public alert: AlertController,
    public router: Router,
    public afstore: AngularFirestore
  ) { }

  ngOnInit() {}
  
  //Verifica que todo exista y tenga value, si tiene, registra, si no, te tira un alert

  async register(){
    if(this.username == ''){
      this.showAlert('Error','Please use a valid email');
    }else if(this.password == ''){
      this.showAlert('Error','Please use a valid password');
    }else if(this.form[0].isChecked == false && this.form[1].isChecked == false){
      this.showAlert('Error','Please select a gender'); 
    }else if(this.age < 13 || Number.isInteger(this.age) == false){
      this.showAlert('Error','Please use a valid age');
    }else if(this.password === this.cpassword){try{
      const res = await this.afauth.auth.createUserWithEmailAndPassword(this.username, this.password);
      const gay = this.rugay();   
      this.afstore.doc(`users/${res.user.uid}`).set({
        name: this.username,
        age: this.age,
        sex: gay,
        isAdmin: 'false',
        description: '',
        Like1: '',
        like2: '',
        like3: '',
        hate1: '',
        hate2: '',
        hate3: ''
      })
      console.log(res);
      this.router.navigate(['/home']);
    } catch(err){
      console.log(err);
      console.log(err.message);
      this.showAlert('Error',err.message);
    }}
    else{
      this.showAlert('Error','The passwords are different');
    }

  }

//Para que no se pueda tener varios checkbox al mismo tiempo

  change(bool: number){

    switch (bool) {
      case 0:
        if(this.form[0].isChecked == true && this.form[1].isChecked == true){
          this.form[1].isChecked = false;
         }
         break;
    
      case 1:
        if(this.form[0].isChecked == true && this.form[1].isChecked == true){
          this.form[0].isChecked = false;
        }

      default:
        break;
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

  //Verificacion de sexo con nombre profesional
  rugay(){
    if(this.form[0].isChecked == true)
      return 'Hombre'
    else
      return 'Mujer'
  }

}
