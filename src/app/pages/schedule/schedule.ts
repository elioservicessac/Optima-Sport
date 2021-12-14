import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform, AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { JsonService } from './../../json.service';
import { ActivatedRoute } from '@angular/router';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { SessionDetailPage } from '../session-detail/session-detail';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})
export class SchedulePage implements OnInit {

  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;

  ios: boolean;
  dayIndex = 0;
  queryText = '';
  filterTerm: string;
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;
  static categoria: any;
  categoriaenvista:any;
   nombrecategoriaenvista: any;
  id_categoria: any;
  videos:any;
  videosendata: any;
  tipo_cuenta: any;
  puedevervideos: string;
  isloggedin: any;
  step: any;
  videos_barra: any;
  videosendata_barra: any;
  videosenbarraresultado: any;
  videosenbarraresultadodebusqueda: any;
  diasporcomas: any;
  videosotros: any;
  todosbusquedaglobal: any;
  channelId: string;
  playlists: any;
  listasderepro: any;
  // resultadostodos: any;
  resultadostodos:  Array<any> = [];
  codigos_validos_activar: any;
  respuestaverificarcodigo: any;
  tokenconsulta: any;
  listaconsulta: any;
  playlistsmanual:  Array<any> = [];
  listasderepro2: any;

  constructor(
    private loadingController: LoadingController,
    private menu: MenuController,
    private plt: Platform,
    private youtube: YoutubeVideoPlayer,
    private route: ActivatedRoute,
    public json:JsonService,
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalController: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserData,
    public config: Config
  ) 
  
  {

    this.consultacategoria();


  }

  obtenertokenaliniciar()
  {
    console.log('activo bearer:this.json.beareractivo')
    if(this.json.beareractivo==null||this.json.beareractivo==undefined){
  
      this.tokenconsulta = this.json.obtenertoken();
      this.tokenconsulta.subscribe(datadeltokenresponse => {
        console.log('tokenconsulta full api respuesta: ', datadeltokenresponse);
        this.json.beareractivo=datadeltokenresponse.access_token;
        this.listasdecanalprivadasypublicas();
        });
  
    }
  }

  listasdecanalprivadasypublicas(){

    this.listaconsulta = this.json.obtenercanalesportokenbearerparavideosprivados();
  this.listaconsulta.subscribe(datalista => {
  console.log('listaconsulta full api respuesta por token!: ', datalista);
  console.log('la consulta fue con el berier:',this.json.beareractivo);
  });
  
  }


  reiniciarvariables(){
    this.json.isloggedin='no';
    this.json.tipo_cuenta=undefined;
  }

  consultacategoria(){

    this.step='1';
    this.puedevervideos="no";

    this.route.params.subscribe(params => {
      console.log('params',params);
      //limpiamos las variables
      this.step='1';
      this.showSearchbar=false;
      this.filterTerm='';

      this.nombrecategoriaenvista=params.nombreplaylist;
      let listId = params.id;
      this.id_categoria= params.id;

      //verificamos el inicio de seccion
      this.isloggedin=this.json.isloggedin;
      this.tipo_cuenta=this.json.tipo_cuenta;
      if(this.json.tipo_cuenta>0||this.tipo_cuenta>0){
        this.puedevervideos='si';
      }
      else{
        this.puedevervideos='no';
      }

      this.videos = this.json.getListVideos(listId);
      this.videos.subscribe(data => {
        this.videosendata=data.items;
        console.log('videosendata: ', this.videosendata);
      });

    });
  }

  async openVideo(video) {


    this.menu.enable(true);

    const modal = await this.modalController.create({
      component: SessionDetailPage,
      componentProps: {
        cssClass: 'my-custom-class',
        'dataparaelmodal': video,
      }
    });
    console.log('enviando estos datos al modal qr ya que alla se procesara',video);
    return await modal.present();

    // if (this.plt.is('cordova')) {
    //   this.youtube.openVideo(video.snippet.resourceId.videoId);
    // } else {
    //   window.open('https://www.youtube.com/watch?v=' + video.snippet.resourceId.videoId);
    // }
  }

  reingresar(){
    this.reiniciarvariables();
    this.menu.enable(false);
    this.router.navigate(['/login']);
  }

  sinfuncion(){

  }

  

  ngOnInit() {

    this.consultacategoria();


    this.updateSchedule();

    this.ios = this.config.get('mode') === 'ios';
  }

  ionViewWillEnter(){
    this.consultacategoria();

  }

  ionViewDidEnter(){
        this.consultacategoria();

  }
  ionViewWillLeave(){
        this.consultacategoria();

  }
  ionViewDidLeave(){
        this.consultacategoria();

  }



  static actualizacategoria(p){
    // console.log('p:',p);
    // console.log('se selecciono esta categoria',SchedulePage.categoria);
    // console.log('categoriaenvista',this.nombrecategoriaenvista);
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
    });
  }

  async presentFilter() {
    const modal = await this.modalController.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.updateSchedule();
    }
  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    if (this.user.hasFavorite(sessionData.name)) {
      // Prompt to remove favorite
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // Add as a favorite
      this.user.addFavorite(sessionData.name);

      // Close the open item
      slidingItem.close();

      // Create a toast
      const toast = await this.toastCtrl.create({
        header: `${sessionData.name} was successfully added as a favorite.`,
        duration: 3000,
        buttons: [{
          text: 'Close',
          role: 'cancel'
        }]
      });

      // Present the toast at the bottom of the page
      await toast.present();
    }

  }

  async removeFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any, title: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }

  changecodigo(event){
    this.codigos_validos_activar=event.target.value;
  }

  async verificar(){

    const mensajeactualizando = await this.loadingController.create({
      message: 'Cargando, porfavor espere...',spinner: 'bubbles',duration: 20000,
      });
      const exitosa = await this.loadingController.create({
        message: 'Usuario verificado!, debe reingresar',spinner: 'bubbles',duration: 4700,
        });
        const verifique = await this.loadingController.create({
          message: 'verifique su codigo',spinner: 'bubbles',duration: 2000,
          });
      mensajeactualizando.present()
    var dataverificarcodigo = {
      nombre_solicitud:'verificarcodigo',
      codigos_validos_activar:this.codigos_validos_activar,
    }
      this.json.variasfunciones(dataverificarcodigo).subscribe((res: any ) =>{
            console.log(' respuesta verificarcodigo ',res);
            this.respuestaverificarcodigo=res;

            if(res){

         

            if(this.respuestaverificarcodigo.id_inutilizado>0){
              mensajeactualizando.dismiss(); 

                  var dataverificarusuario = {
      nombre_solicitud:'verificarusuario',
      codigos_validos_activar:this.codigos_validos_activar,
      username: this.json.username
    }
      this.json.variasfunciones(dataverificarusuario).subscribe((res: any ) =>{
            console.log(' respuesta verificarusuario ',res);
            if(res=1){
              exitosa.present();
              this.reingresar();


              var datadesactivarcodigo = {
                nombre_solicitud:'desactivarcodigo',
                codigos_validos_activar:this.codigos_validos_activar,
              }
                this.json.variasfunciones(datadesactivarcodigo).subscribe((res: any ) =>{
                  console.log(' respuesta desactivarcodigo ',res);

                });

            }

            });
            }
            else{
              mensajeactualizando.dismiss();  
              verifique.present(); 

            }


          }

          else{
            mensajeactualizando.dismiss();  
            verifique.present(); 
          }

            });


            
  }


  paso2(){

//se creara un array manual para mostrarlo en el menu:
// this.playlistsmanual[0].id='PLwt81QUNa7aZaOhJ01796S40pjltqldG3'
//plataformas fuerza
this.playlistsmanual[0]={
  id:"PLwt81QUNa7aZGUYCWM9yGWsXGnAfm5yXt",
  snippet: 
  {
    title:'PLATAFORMA FUERZA #1',
    thumbnails:
    {
    default:{url:"https://i.ytimg.com/vi/9WLgVvUDE9o/default.jpg"}
    }
  }
}
this.playlistsmanual[1]={
  id:"PLwt81QUNa7aZ_lX85HHGLkz-ONsoKIVaT",
  snippet: 
  {
    title:'PLATAFORMA FUERZA #2',
    thumbnails:
    {
    default:{url:"https://i.ytimg.com/vi/lpXHFxfLLcc/default.jpg"}
    }
  }
}
this.playlistsmanual[2]={
  id:"PLwt81QUNa7aZehM_1rC2HofkxyADLl9R4",
  snippet: 
  {
    title:'PLATAFORMA FUERZA #3',
    thumbnails:
    {
    default:{url:"https://i.ytimg.com/vi/v3mgzTJdttg/default.jpg"}
    }
  }
}
this.playlistsmanual[3]={
  id:"PLwt81QUNa7aZVgVY4mh3luivSraNHaqKo",
  snippet: 
  {
    title:'PLATAFORMA FUERZA #4',
    thumbnails:
    {
    default:{url:"https://i.ytimg.com/vi/vv0yndHwXT0/default.jpg"}
    }
  }
}
    this.playlistsmanual[4]={
  id:"PLwt81QUNa7aaObAdO-RC9CIMMwHTrlMRn",
  snippet: 
  {
    title:'PLATAFORMA FUERZA #5',
    thumbnails:
    {
    default:{url:"https://i.ytimg.com/vi/wdWZpWI13T8/default.jpg"}
    }
  }
}
this.playlistsmanual[5]={
  id:"PLwt81QUNa7abrgyl_ra0Wh19y3ScSDQq4",
  snippet: 
  {
    title:'PLATAFORMA FUERZA #6',
    thumbnails:
    {
    default:{url:"https://i.ytimg.com/vi/leoC3BTHCeo/default.jpg"}
    }
  }
}
this.playlistsmanual[6]={
  id:"PLwt81QUNa7aaVuZCN25KeMqI8jk6qWLIw",
  snippet: 
  {
    title:'PLATAFORMA FUERZA #7',
    thumbnails:
    {
    default:{url:"https://i.ytimg.com/vi/VbtPBA41nYI/default.jpg"}
    }
  }
}
this.playlistsmanual[7]={
  id:"PLwt81QUNa7aaGiZewDQJwDepOZd2Nn99a",
  snippet: 
  {
    title:'PLATAFORMA FUERZA #8',
    thumbnails:
    {
    default:{url:"https://i.ytimg.com/vi/TD5ZJACvvJs/default.jpg"}
    }
  }
}
this.playlistsmanual[8]={
  id:"PLwt81QUNa7aYL20Vv1CgdM893rhFAYFel",
  snippet: 
  {
    title:'PLATAFORMA FUERZA #9',
    thumbnails:
    {
    default:{url:"https://i.ytimg.com/vi/2eiAWtEgv6Y/default.jpg"}
    }
  }
}
this.playlistsmanual[9]={
  id:"PLwt81QUNa7aYv3vN1Sqaevk1dXjL2qiej",
  snippet: 
  {
    title:'PLATAFORMA FUERZA #10',
    thumbnails:
    {
    default:{url:"https://i.ytimg.com/vi/JnVlxegwehM/default.jpg"}
    }
  }
}

//terminan plataformas fuerzas

//plataformas runner

  this.playlistsmanual[10]={
    id:"PLwt81QUNa7aZwa0zaPo-nl091octaBBPs",
    snippet: 
    {
      title:'PLATAFORMA ABDOMINAL # 1',
      thumbnails:
      {
      default:{url:"https://i.ytimg.com/vi/_RrqgII0a_o/hqdefault.jpg"}
      }
    }
  }
  this.playlistsmanual[11]={
    id:"PLwt81QUNa7aYzewLV76UYmHAtb5t_g9Qj",
    snippet: 
    {
      title:'PLATAFORMA ABDOMINAL # 2',
      thumbnails:
      {
      default:{url:"https://i.ytimg.com/vi/mi4ZKhTH-3k/hqdefault.jpg"}
      }
    }
  }
//   this.playlistsmanual[12]={
//     id:"PLwt81QUNa7aZWO2os2v9Wcvb-eSTFEQ3z",
//     snippet: 
//     {
//       title:'LA RESISTENCIA RUNNER # 3',
//       thumbnails:
//       {
//       default:{url:"https://i.ytimg.com/vi/Soec2ZCwdh0/default.jpg"}
//       }
//     }
// }

//plataformas runner


this.playlistsmanual[12]={
id:"PLwt81QUNa7aZqfNY8Xc4W80mlEYL7e3eQ",
snippet: 
{
title:"PLATAFORMA TEC POSTURA",
thumbnails:
{
default:{url:"https://i.ytimg.com/vi/CuvcW6NZwZc/default.jpg"}
}
}
}

this.playlistsmanual[13]={
id:"PLwt81QUNa7aYOtpMxogQfiaFYOw3aP1x_",
snippet: 
{
title:"PLATAFORMA TEC PISADA",
thumbnails:
{
default:{url:"https://i.ytimg.com/vi/cK1lZ0nRYkc/default.jpg"}
}
}
}

this.playlistsmanual[14]={
id:"PLwt81QUNa7abyMzhTM1Omn16tBhQsNesC",
snippet: 
{
title:"PLATAFORMA TEC PLIOMETRÍA",
thumbnails:
{
default:{url:"https://i.ytimg.com/vi/qAVrXSPCzyY/default.jpg"}
}
}
}


this.playlistsmanual[15]={
id:"PLwt81QUNa7aby2Q3_x986ocgWwM3eweWZ",
snippet: 
{
title:"PLATAFORMA FOAMROLLER",
thumbnails:
{
default:{url:"https://i.ytimg.com/vi/5usGm_hmDIA/default.jpg"}
}
}
}

this.playlistsmanual[16]={
id:"PLwt81QUNa7aalizTLlptDbU7HDdPNKdIZ",
snippet: 
{
title:"PLATAFORMA ESTIRAMIENTOS",
thumbnails:
{
default:{url:"https://i.ytimg.com/vi/9XHqGzC8R3o/default.jpg"}
}
}
}

this.listasderepro2=this.playlistsmanual;





    this.step='2';
    console.log('seprocedera al paso 2');
    // this.json.barrabusqueda();
    // this.resultadostodos=null;
    this.resultadostodos.length = 0;

    this.channelId="UCsLb1egga3Aeh_kfMUUietg";
    this.playlists = this.json.getPlaylistsForChannel();
    this.playlists.subscribe(data => {
      console.log('playlists full api respuesta: ', data);
      this.listasderepro=data.items;
      console.log('solo listas de reproduccion: ', data.items);
      console.log('solo listas de reproduccion tras busqueda y arreglo manual: ', this.playlistsmanual);

      this.videosendata_barra=this.playlistsmanual;
      console.log('videosendata_barra: ', this.videosendata_barra);
      for (var i=0; i<this.videosendata_barra.length; i++) { 
  
        this.videosotros = this.json.getListVideos(this.videosendata_barra[i].id);
        this.videosotros.subscribe(data2 => {
  
          console.log('data2',data2.items);
  
          for (var f=0; f<data2.items.length; f++) { 
            console.log('data en f', data2.items[f]);
            this.resultadostodos.push(data2.items[f]);
            console.log('resultadostodos',this.resultadostodos);
          }
  
        });
        
      }

    });



  



  }

  
  volverapaso1(){
    this.step='1';
    this.showSearchbar=false;
    this.filterTerm='';
    console.log('seprocedera al paso 2'); 
  }

  closeycancelboton(){
    this.step='1';
    this.showSearchbar=false;
    this.filterTerm='';
  }

  

}
