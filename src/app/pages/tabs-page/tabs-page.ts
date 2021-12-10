import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController,LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonService } from './../../json.service';
import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

@Component({
  templateUrl: 'tabs-page.html'
})

@Injectable({
  providedIn: 'root'
})
export class TabsPage {


  constructor(
    private json: JsonService,
    public userData: UserData,
    public router: Router
  )
  
  {

  }
  

}
