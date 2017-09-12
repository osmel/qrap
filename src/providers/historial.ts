import { Injectable } from '@angular/core';

import { ScanData } from "../models/scan-data.model";  //importamos el modelo

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';




import { ModalController, Platform, ToastController } from "ionic-angular"; //
import { MapaPage } from "../pages/mapa/mapa";




@Injectable()
export class HistorialService {

  private _historial:ScanData[] = [];   //arreglo de tipo modelo


  constructor( private iab: InAppBrowser,
              private modalCtrl: ModalController,
              private contacts: Contacts,
               private platform:Platform,
               private toastCtrl:ToastController
               
               ) { }



  cargar_historial(){  //cuando alguien llame al historial vamos a regresar todos los valores que tenga el arreglo _historial
    return this._historial;
  }

  agregar_historial( texto:string ){  //este sería para insertar elementos al arreglo historial

    let data = new ScanData( texto ); //creamos de tipo modelo

    this._historial.unshift( data );  //unshift para que inserte valores al arreglo al inicio. No al fin como push unshift

    console.log( this._historial );

    this.abrir_scan(0);  //en este caso 0 = al ultimo que se agrego porque el ultimo esta de primero gracias al 


  }


  abrir_scan( index:number){ //recibimos el index de la posicion del array del cual yo quiero abrirlo

    let scanData = this._historial[index];
    console.log( scanData );

    switch( scanData.tipo ){

      case "http":
         //abrir el navegador con la url pasada
         //const browser = this.iab.create('https://ionicframework.com/'); abrir 
        this.iab.create( scanData.info, "_system" );

      break

      case "mapa":

        this.modalCtrl.create( MapaPage, { coords: scanData.info }).present();

      break;

      case "contacto":

          this.crear_contacto(  scanData.info );

      break;

      case "email":

        // "MATMSG:TO:fernando.herrera85@gmail.com;SUB:Hola Mundo;BODY:Saludos Fernando;;"
        let htmlLink = scanData.info;
        // let htmlLink = "mailto:name1@rapidtables.com?subject=hola%20mundo&body=The%20body%20of%20the%20email";

        htmlLink = htmlLink.replace("MATMSG:TO:","mailto:");
        htmlLink = htmlLink.replace(";SUB:", "?subject=");
        htmlLink = htmlLink.replace(";BODY:", "&body=");
        htmlLink = htmlLink.replace(";;", "");
        htmlLink = htmlLink.replace(/ /g, "%20");

        console.log(htmlLink);

        this.iab.create( htmlLink, "_system" );



      break;

      default:
        console.error("Tipo no soportado");

    }


  }


  private crear_contacto( texto:string ){

    let campos:any = this.parse_vcard( texto );
    console.log( campos );

    let nombre = campos['fn'];
    let tel    = campos.tel[0].value[0];


    if( !this.platform.is('cordova') ){
      console.warn("Estoy en la computadora, no puedo crear contacto.");
      return;
    }
    

    
    //Crear contacto en el dispositivo (contactos del dispositivo)
    let contact: Contact = this.contacts.create();

    contact.name = new ContactName(null, nombre );
    contact.phoneNumbers = [ new ContactField('mobile', tel ) ];

    contact.save().then(
      ()=> this.crear_toast("Contacto " + nombre + " creado!"),
      (error) => this.crear_toast( "Error: " + error )
    );


  }

  private crear_toast( mensaje:string ){

    this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    }).present();

  }


  //funcion para leer toda la vcard y regresar un objeto que vamos a poder leer con facilidad
  private parse_vcard( input:string ) {

    var Re1 = /^(version|fn|title|org):(.+)$/i;
    var Re2 = /^([^:;]+);([^:]+):(.+)$/;
    var ReKey = /item\d{1,2}\./;
    var fields = {};

    input.split(/\r\n|\r|\n/).forEach(function (line) {
        var results, key;

        if (Re1.test(line)) {
            results = line.match(Re1);
            key = results[1].toLowerCase();
            fields[key] = results[2];
        } else if (Re2.test(line)) {
            results = line.match(Re2);
            key = results[1].replace(ReKey, '').toLowerCase();

            var meta = {};
            results[2].split(';')
                .map(function (p, i) {
                var match = p.match(/([a-z]+)=(.*)/i);
                if (match) {
                    return [match[1], match[2]];
                } else {
                    return ["TYPE" + (i === 0 ? "" : i), p];
                }
            })
                .forEach(function (p) {
                meta[p[0]] = p[1];
            });

            if (!fields[key]) fields[key] = [];

            fields[key].push({
                meta: meta,
                value: results[3].split(';')
            })
        }
    });

    return fields;
};





}
