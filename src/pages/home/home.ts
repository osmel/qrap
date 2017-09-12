import { Component } from '@angular/core';
//import {  NavController, NavParams } from 'ionic-angular';


// Componentes
import { ToastController, Platform } from 'ionic-angular';

// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

//servicios
import {HistorialService } from "../../providers/historial";


/**
 * Generated class for the homePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: ToastController,
    private platform: Platform, //para detectar si esta en un dispositivo o si esta en un navegador
    private _historialService:HistorialService) {}




scan(){
    console.log("Realizando scan...");

     //retorna una promesa
     if( !this.platform.is('cordova') ){
         //this._historialService.agregar_historial( "http://google.com");   //simulando url
         //this._historialService.agregar_historial( "geo:9.976133040865312,-84.00677479055173" );  //simulando geo MAPA

//no tabular porq pierde la forma
       this._historialService.agregar_historial( `BEGIN:VCARD
VERSION:2.1
N:Kent;Clark
FN:Clark Kent
ORG:
TEL;HOME;VOICE:12345
TEL;TYPE=cell:67890
ADR;TYPE=work:;;;
EMAIL:clark@superman.com
END:VCARD` );


        return;
     }
    this.barcodeScanner.scan().then((barcodeData) => {  //si tiene exito
       console.log("datos del scan:", barcodeData);
       console.log("result:", barcodeData.text );
       console.log("format:", barcodeData.format );
       console.log("cancelled:", barcodeData.cancelled );  //0=no cancelado, 1=cancelado

     if ( !(barcodeData.cancelled)  && barcodeData.text != null ) {
         this._historialService.agregar_historial( barcodeData.text  );
     }


    }, (err) => {  //si falla
        console.error("Error: ", err ); //cdo lo pruebas en el navegador va a dar este error "cordova_not_available". Porq solo funciona en los dispositivos
                                      //cordova no funciona en el navegador web

        //usando el toast
        this.mostrar_error( "Error: " + err );                                      
    });    

}




  //mi funcion TOAST para mostrar error
  mostrar_error( mensaje:string ){

    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    });

    toast.present();

  }



}

