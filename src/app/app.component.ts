import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { AlertController, MenuController, Platform, ToastController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Storage } from '@ionic/storage';

import { UserData } from './providers/user-data';
import { SchedulePage } from './pages/schedule/schedule';
import { JsonService } from './json.service';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
// import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  channelId = this.json.channelId; // Devdactic Channel ID
  playlists: any;
  

  appPages = [
    {
      title: 'Schedule',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    {
      title: 'Speakers',
      url: '/app/tabs/speakers',
      icon: 'people'
    },
    {
      title: 'Map',
      url: '/app/tabs/map',
      icon: 'map'
    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information-circle'
    }
  ];
  loggedIn = false;
  dark = true;
  listasderepro: any;
  listasderepro2: any;
  enviarporparams:any;
  response: void;
  tokenconsulta: any;
  listaconsulta: any;
 
  playlistsmanual:  Array<any> = [];


  constructor(
    public alertCtrl: AlertController,
    private youtube: YoutubeVideoPlayer,
    public json:JsonService,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    // public schedule: SchedulePage
  ) 
  
  {





console.log('playlistsmanual',this.playlistsmanual);


    this.creararraymanualyenviaravista();

    // this.obtenertokenaliniciar();
    
    this.initializeApp();


    this.channelId=this.json.channelId;
    this.playlists = this.json.getPlaylistsForChannel();
    this.playlists.subscribe(data => {
      console.log('playlists full api respuesta: ', data);
      this.listasderepro=data.items;
      console.log('solo listas de reproduccion: ', data);


    });
    
  }
  
//   obtenertokenaliniciar()
// {
//   console.log('activo bearer:this.json.beareractivo')
//   if(this.json.beareractivo==null||this.json.beareractivo==undefined){

//     this.tokenconsulta = this.json.obtenertoken();
//     this.tokenconsulta.subscribe(datadeltokenresponse => {
//       console.log('tokenconsulta full api respuesta: ', datadeltokenresponse);
//       this.json.beareractivo=datadeltokenresponse.access_token;
//       this.listasdecanalprivadasypublicas();
//       });

//   }
// }

  iralpaneladmin(){
    // this.router.navigate(['/signup']);
    this.router.navigateByUrl('/signup');
    this.menu.close();
  }



  searchPlaylists() {
    this.playlists = this.json.getPlaylistsForChannel();
    this.playlists.subscribe(data => {
      console.log('playlists: ', data);

    });
  }
 
  openPlaylist(id) {
    // this.navCtrl.push('PlaylistPage', {id: id});
  }


  // enviarcategoria(p){
  //   this.json.nombrecategoriaservicio=p.title;
  //   this.json.datacategoriaservicio=p;
  //   SchedulePage.categoria=p.title;
  //   SchedulePage.actualizacategoria(p);
  // }

  enviarcategoria(list){
    
  //  this.json.nombrecategoriaservicio=p.title;
    // this.json.datacategoriaservicio=p;
    // this.schedule.updateSchedule();
    // SchedulePage.updateSchedule();

    var enviarporparams = {
      nombreplaylist:list.snippet.title,
      id:list.id
    }

    console.log('enviar esta categoria', enviarporparams);
    this.router.navigate(['/app/tabs/schedule', enviarporparams]);
    // return this.router.navigateByUrl('/app/tabs/schedule',p);
  }

  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {
    // this.userData.logout().then(() => {
      // return this.router.navigateByUrl('/app/tabs/schedule');
      this.menu.enable(false);
      this.router.navigate(['/login']);

    // });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }


  api(){



}

// listasdecanalprivadasypublicas(){

//   this.listaconsulta = this.json.obtenercanalesportokenbearerparavideosprivados();
// this.listaconsulta.subscribe(datalista => {
// console.log('listaconsulta full items api respuesta por token!: ', datalista.items);
// console.log('la consulta fue con el berier:',this.json.beareractivo);
// this.listasderepro2=datalista.items;

// });

// }

creararraymanualyenviaravista(){
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

}



}
