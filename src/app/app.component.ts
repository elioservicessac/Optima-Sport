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
  channelId = 'UCWHrwVR0pX247lyy14xY7cA'; // Devdactic Channel ID
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
  enviarporparams:any;
 
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
    this.initializeApp();


    this.channelId="UCWHrwVR0pX247lyy14xY7cA";
    this.playlists = this.json.getPlaylistsForChannel(this.channelId);
    this.playlists.subscribe(data => {
      console.log('playlists full api respuesta: ', data);
      this.listasderepro=data.items;
      console.log('solo listas de reproduccion: ', data);


    });
    
  }

  iralpaneladmin(){
    // this.router.navigate(['/signup']);
    this.router.navigateByUrl('/signup');
    this.menu.close();
  }



  searchPlaylists() {
    this.playlists = this.json.getPlaylistsForChannel(this.channelId);
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
}
