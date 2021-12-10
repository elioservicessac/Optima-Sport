import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController,LoadingController, AlertController } from '@ionic/angular';

// import { RequestOptions } from '@angular/http';
//importo las respuestas nativas del servidor
// import { Http, Response } from '@angular/http'
import { map } from 'rxjs/operators'; //importo calculos reactivos de .map y .filter
// import 'rxjs/Rx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
// import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class JsonService {

  apiKey = 'AIzaSyDNqNstN55PH7hSL7ythSOxNZfTKvWJb7Y';
  channelId = 'UCWHrwVR0pX247lyy14xY7cA';

  public nombrecategoriaservicio: any;
  public datacategoriaservicio: any;
  public isloggedin: any ='no';
  public tipo_cuenta: any;
  username: any;

  constructor(
    private youtube: YoutubeVideoPlayer,
    public loadingController: LoadingController,
    private http: HttpClient

  )
  
  {


  }

  variasfunciones(data: any)
  {
  var url = 'https://api.orongo2-0.ml/api/variasfunciones';
  return this.http.post(url,data,
  {headers:new HttpHeaders({"Content-Type":'application/json'})});
  }



  async dismisscargandofuncion(){

  }

  getPlaylistsForChannel(channel) {
    return this.http.get('https://www.googleapis.com/youtube/v3/playlists?key=' + this.apiKey + '&channelId=' + channel + '&part=snippet,id&maxResults=30')
    
  }
 
  // getListVideos(listId) {
  //   return this.http.get('https://www.googleapis.com/youtube/v3/playlistItems?key=' + this.apiKey + '&playlistId=' + listId +'&part=snippet,id&maxResults=40')
    
  // }


  // getListVideos(listId) {
  //   return this.http.get('https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyDNqNstN55PH7hSL7ythSOxNZfTKvWJb7Y&playlistId=PLis_1RBMtTVWp55Ug0Plwszyar0rmyEp6')
    
  // }


  getListVideos(listId) {
    return this.http.get('https://www.googleapis.com/youtube/v3/playlistItems?key=' + this.apiKey + '&part=snippet&playlistId=' + listId + '&maxResults=20')
    
  }


  // https://www.googleapis.com/youtube/v3/search?channelId=UCWHrwVR0pX247lyy14xY7cA

  barrabusqueda() {
    return this.http.get('https://www.googleapis.com/youtube/v3/search?channelId='+this.channelId+'&key=AIzaSyDNqNstN55PH7hSL7ythSOxNZfTKvWJb7Y&part=snippet&maxResults=20')
  
  }


}
