import { Component } from '@angular/core';
import { NavParams, ModalController, MenuController, Platform, ToastController } from '@ionic/angular';
import { ConferenceData } from '../../providers/conference-data';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'page-session-detail',
  styleUrls: ['./session-detail.scss'],
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;
  isFavorite = false;
  defaultHref = '';
  traidopormodalparams: any;
  linkid: any;
  linkcompleto: string;
  youtubeSrc: any;
  link1: any;
  link2: any;
  link3: any;



  constructor(
    public sanitizer: DomSanitizer,
    navParams: NavParams,
    public modalController: ModalController,
    private menu: MenuController,
    private dataProvider: ConferenceData,
    private userProvider: UserData,
    private route: ActivatedRoute
  )
  
   { 

    this.traidopormodalparams=navParams.get('dataparaelmodal');
    console.log('recibido por modalparams', this.traidopormodalparams);
    this.linkid=this.traidopormodalparams.snippet.resourceId.videoId;
    console.log('this.linkid:',this.linkid);
    this.youtubeSrc = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+this.linkid);        
   }

  ionViewWillEnter() {

}

dismiss() {
  // using the injected ModalController this page
  // can "dismiss" itself and optionally pass back data
  this.modalController.dismiss({
    'dismissed': true
  });
}


}