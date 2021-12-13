import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { JsonService } from './../../json.service';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signup: UserOptions = { username: '', password: '' };
  submitted = false;
  codigos_validos_activar:any;
  respuestaobtenercodigosoptimacodigosdeactivacion: any;
  tipo_cuenta: any;
  step: any;
  respuestaagregarcodigo: any;
  respuestatodoslosusuarios: any;
  username: any;

  constructor(
    private loadingController: LoadingController,
        public json:JsonService,
    public router: Router,
    public userData: UserData
  )
   {

      this.step='1';
      this.consultadecodigos();
   }

    ngOnInit() {
      this.step='1';
    this.consultadecodigos();
    }

    ionViewWillEnter(){
      this.step='1';
    this.consultadecodigos();
    }

    ionViewDidEnter(){
      this.step='1';
    this.consultadecodigos();
    }
    ionViewWillLeave(){
      this.step='1';
    this.consultadecodigos();
    }
    ionViewDidLeave(){
      this.step='1';
    this.consultadecodigos();
    }

   async consultadecodigos(){

    const actualziando = await this.loadingController.create({
      message: 'Actualizando...',spinner: 'bubbles',duration: 20000,
      });
      actualziando.present();

     this.tipo_cuenta=this.json.tipo_cuenta;

    var dataobtenercodigosoptimacodigosdeactivacion = {
      nombre_solicitud:'obtenercodigosoptimacodigosdeactivacion',
      tipo_cuenta:this.tipo_cuenta
    }
      this.json.variasfunciones(dataobtenercodigosoptimacodigosdeactivacion).subscribe((res: any ) =>{
            console.log(' respuesta obtenercodigosoptimacodigosdeactivacion ',res);
            actualziando.dismiss();
            this.respuestaobtenercodigosoptimacodigosdeactivacion=res;
      });
   }

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.signup(this.signup.username);
      this.router.navigateByUrl('/app/tabs/schedule');
    }
  }

  changecodigosvalidosactivar(event){console.log('change',event.target.value)

    this.codigos_validos_activar=event.target.value;
  } 

  async agregarcodigo(){

    const agregando = await this.loadingController.create({
      message: 'agregando código, porfavor espere',spinner: 'bubbles',duration: 14000,
      });
    const agreado = await this.loadingController.create({
      message: 'verifique su codigo',spinner: 'bubbles',duration: 1000,
      });


    var dataagregarcodigo = {
      nombre_solicitud:'agregarcodigo',
      codigos_validos_activar: this.codigos_validos_activar
    }
      this.json.variasfunciones(dataagregarcodigo).subscribe((res: any ) =>{
            console.log(' respuesta verificarusuario ',res);
            this.respuestaagregarcodigo=res;
            if(res.id>0){
              agregando.dismiss();
              agreado.present();
              this.consultadecodigos();
            }
       });
  }


  
  async step2(){

    this.step='2';
    const actualizando = await this.loadingController.create({
      message: 'actualizando',spinner: 'bubbles',duration: 14000,
      });
      actualizando.present();

      var datatodoslosusuarios = {
        nombre_solicitud:'todoslosusuarios',
        tipo_cuenta:this.tipo_cuenta
      }
        this.json.variasfunciones(datatodoslosusuarios).subscribe((res: any ) =>{
              console.log(' respuesta todoslosusuarios ',res);
              this.respuestatodoslosusuarios=res;
              actualizando.dismiss();

              
            });  

  }

  
  async step1(){
    this.step='1';

  }

  
  async activarusuario(cadausuario){
    
    const actualizando = await this.loadingController.create({
      message: 'activando',spinner: 'bubbles',duration: 14000,
      });
      actualizando.present();

      var dataactivarusuariopanel = {
        nombre_solicitud:'activarusuariopanel',
        username: cadausuario.username
      }
        this.json.variasfunciones(dataactivarusuariopanel).subscribe((res: any ) =>{
              console.log(' respuesta activarusuariopanel ',res);
              actualizando.dismiss();

              
              //desactivado/activado actualizamos lista...
              this.step2()

            });  

    


  }

  
  async desactivarusuario(cadausuario){
    
    const actualizando = await this.loadingController.create({
      message: 'desactivando',spinner: 'bubbles',duration: 14000,
      });
      actualizando.present();

      var datadesactivarusuariopanel = {
        nombre_solicitud:'desactivarusuariopanel',
        username: cadausuario.username
      }
        this.json.variasfunciones(datadesactivarusuariopanel).subscribe((res: any ) =>{
              console.log(' respuesta desactivarusuariopanel ',res);
              actualizando.dismiss();

              //desactivado/activado actualizamos lista...
              this.step2();

              
            });  

    
  }
}
