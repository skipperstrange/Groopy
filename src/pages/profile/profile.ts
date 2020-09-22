import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaHandlerProvider } from '../../providers/media-handler/media-handler';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  moveOn = true
  photoUrl: string

  constructor(public navCtrl: NavController, public navParams: NavParams,public imageService: MediaHandlerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  proceed(){
  this.navCtrl.setRoot('TabsPage')
  }

  chooseImg(){
    this.imageService.uploadImage().then((res)=>{
      console.log(res)
    })
  }

}
