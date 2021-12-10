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

  constructor(
    private loadingController: LoadingController,
        public json:JsonService,
    public router: Router,
    public userData: UserData
  )
   {

      this.consultadecodigos();
   }

    ngOnInit() {
    this.consultadecodigos();
    }

    ionViewWillEnter(){
    this.consultadecodigos();
    }

    ionViewDidEnter(){
    this.consultadecodigos();
    }
    ionViewWillLeave(){
    this.consultadecodigos();
    }
    ionViewDidLeave(){
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

  

  
}
