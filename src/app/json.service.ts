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
  beareractivo:string;

  public nombrecategoriaservicio: any;
  public datacategoriaservicio: any;
  public isloggedin: any ='no';
  public tipo_cuenta: any;
  username: any;
  client_id: string;
  client_secret: string;
  refresh_token: string;

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

  getPlaylistsForChannel() {
    return this.http.get('https://www.googleapis.com/youtube/v3/playlists?key=' + this.apiKey + '&channelId=' + this.channelId + '&part=snippet,id&maxResults=50')
    
  }
 
  getListVideos(listId) {
    return this.http.get('https://www.googleapis.com/youtube/v3/playlistItems?key=' + this.apiKey + '&part=snippet&playlistId=' + listId + '&maxResults=50')
    
  }

  barrabusqueda() {
    return this.http.get('https://www.googleapis.com/youtube/v3/search?channelId='+this.channelId+'&key='+this.apiKey+'&part=snippet&maxResults=50')
  
  }

  obtenertoken(){

    var data = {

    }

    this.client_id='491180233867-ptm7aki12m6rps6b4hittpb8c5fpq406.apps.googleusercontent.com';
    this.client_secret='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';
    this.refresh_token='1//04NQ_qhuwW9_aCgYIARAAGAQSNwF-L9Irmf6CQD4t1mwMQJ7uxrriKp6mxlEz4eJmjDjSvSQpCvx8SZ9fRpts3ZQR6-br1YAvupE';

    var url = 'https://oauth2.googleapis.com/token?client_id='+this.client_id+'&client_secret='+this.client_secret+'&refresh_token='+this.refresh_token+'&grant_type=refresh_token';
    return this.http.post(url,data,
    {headers:new HttpHeaders({"Content-Type":'application/json'})});
  }


    obtenercanalesportokenbearerparavideosprivados()
  {
  var url = 'https://www.googleapis.com/youtube/v3/playlists?key='+this.apiKey+'&status=status&part=snippet,status&maxResults=50&mine=true';
  return this.http.get(url,
  {headers:new HttpHeaders({"Authorization":'Bearer '+this.beareractivo})});
  }




}
