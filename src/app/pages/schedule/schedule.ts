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

  constructor(
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


  reiniciarvariables(){
    this.json.isloggedin='no';
    this.json.tipo_cuenta=undefined;
  }

  consultacategoria(){
    this.puedevervideos="no";

    this.route.params.subscribe(params => {
      console.log('params',params);
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
}
