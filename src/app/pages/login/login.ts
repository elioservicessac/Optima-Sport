import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonService } from './../../json.service';
import { UserData } from '../../providers/user-data';
import { NavController,LoadingController, AlertController } from '@ionic/angular';
import { UserOptions } from '../../interfaces/user-options';
import { MenuController, Platform, ToastController } from '@ionic/angular';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  estacontrasena: any ='';
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(
    private menu: MenuController,
    public loadingController: LoadingController,
    private json: JsonService,
    public userData: UserData,
    public router: Router
  )
  
  
  { 
    this.menu.enable(false);
    this.reiniciarvariables();

  }

  reiniciarvariables(){
    this.json.isloggedin='no';
    this.json.tipo_cuenta=undefined;
  }

  
  CHANGEcontrasena(event) { console.log('onchange', event.target.value);
    this.estacontrasena=event.target.value;
  }

  async onLogin(form: NgForm) {

    this.reiniciarvariables();


    const mensajeactualizando = await this.loadingController.create({
      message: 'Cargando, porfavor espere...',spinner: 'bubbles',duration: 20000,
      });
      const exitoso = await this.loadingController.create({
        message: 'Autenticación exitosa redirigiendo...',spinner: 'bubbles',duration: 3800,
        });
        const verifique = await this.loadingController.create({
          message: 'contraseña incorrecta, verifique su información!',spinner: 'bubbles',duration: 1800,
          });

    this.submitted = true;

    if (form.valid) {
      mensajeactualizando.present();
      this.userData.login(this.login.username);


      var dataoptimaconsultaruser = {
        nombre_solicitud:'optimaconsultaruser',
        username:this.login.username,
        password:this.estacontrasena
      }
        this.json.variasfunciones(dataoptimaconsultaruser).subscribe((res: any ) =>{
              console.log(' respuesta optimaconsultaruser ',res);
              if(res!='credencialesincorrectas'){
                this.json.isloggedin='si';
                this.json.username=res.username;
                this.json.tipo_cuenta=res.tipo_cuenta;
                exitoso.present();
                mensajeactualizando.dismiss();
                    this.menu.enable(true);
                this.router.navigateByUrl('/app/tabs/schedule');
              }
              else{
                mensajeactualizando.dismiss();
                verifique.present();
              }
              

        });

    }
  }


  ENTERcontrasena(form: NgForm){
    if(this.login.username!=''&&this.estacontrasena!=''){
      console.log('apreto enter y se intenrara logear');
      this.onLogin(form)
    }
  }

  async registrarse(form: NgForm) {

    this.reiniciarvariables();


    const mensajeactualizando = await this.loadingController.create({
      message: 'Cargando, porfavor espere...',spinner: 'bubbles',duration: 20000,
      });
      const creado = await this.loadingController.create({
        message: 'Usuario creado exitosamente, redirigiendo...',spinner: 'bubbles',duration: 5000,
        });
        const seleccioneotro = await this.loadingController.create({
          message: 'Usuario existente, porfavor ingrese otro nombre de usuario...',spinner: 'bubbles',duration: 2000,
          });

    this.submitted = true;

    if (form.valid) {
      mensajeactualizando.present();
      this.userData.login(this.login.username);


      var dataoptimacreateuser = {
        create_date: new Date(),
        nombre_solicitud:'optimacreateuser',
        username:this.login.username,
        password:this.estacontrasena,
        tipo_cuenta:'0'
      }
        this.json.variasfunciones(dataoptimacreateuser).subscribe((res: any ) =>{
              console.log(' respuesta optimacreateuser ',res);
              if(res.id>0){
                mensajeactualizando.dismiss();
                creado.present();
                this.menu.enable(true);
                this.json.isloggedin='si';
                this.router.navigateByUrl('/app/tabs/schedule');
              }
              else{
                mensajeactualizando.dismiss();
                seleccioneotro.present();
              }
        });

    }
  }
  
}
