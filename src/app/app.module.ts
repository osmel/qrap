import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { GuardadosPage, HomePage, MapaPage, TabsPage } from "../pages/index.paginas";

//mapas
import { AgmCoreModule } from '@agm/core';

//servicios
import {HistorialService } from "../providers/historial";

//plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';  //leer codigo QR
import { InAppBrowser } from '@ionic-native/in-app-browser';   //lanzar navegador
import { Contacts} from '@ionic-native/contacts';  //contactos del dispositivo


@NgModule({
  declarations: [
    MyApp,
    GuardadosPage,
    HomePage,
    MapaPage,
    TabsPage    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({  //llave para google map
      apiKey: 'AIzaSyCeJxj4YOh5k129yWUSDQDvpYzbWNR13jk'
    })

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GuardadosPage,
    HomePage,
    MapaPage,
    TabsPage    

  ],
  providers: [
    StatusBar,
    SplashScreen,
    
    BarcodeScanner,  //cordova: codigo qr
    InAppBrowser, //cordova: navegador nativo de app
    Contacts, //contactos del dispositivo
    HistorialService,  //servicio creado



    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

