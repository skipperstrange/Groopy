import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController  } from 'ionic-angular';
import { MediaHandlerProvider } from '../../providers/media-handler/media-handler';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePicPage');
  }

  ionViewWillEnter(){
    this.loadUserDetails()
  }

  loadUserDetails(){

  }

  editImage(){

  }

  editDisplayName(){

  }

  logout(){

  }

}
