import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(
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

   consultadecodigos(){
     this.tipo_cuenta=this.json.tipo_cuenta;

    var dataobtenercodigosoptimacodigosdeactivacion = {
      nombre_solicitud:'obtenercodigosoptimacodigosdeactivacion',
      tipo_cuenta:this.tipo_cuenta
    }
      this.json.variasfunciones(dataobtenercodigosoptimacodigosdeactivacion).subscribe((res: any ) =>{
            console.log(' respuesta obtenercodigosoptimacodigosdeactivacion ',res);
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

  

  
}
