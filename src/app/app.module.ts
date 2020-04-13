import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFirestoreModule } from '@angular/fire/firestore'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';
import { usersService } from './users.service';
import { FormServiceService } from './form-service.service';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { Camera } from '@ionic-native/camera/ngx'

@NgModule({
  declarations: [AppComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    UcWidgetModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    usersService,
    FormServiceService,
    Camera,
    LocalNotifications
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
