import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { userCreds } from '../../models/interfaces/usercreds';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  userCredentials = {} as userCreds;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider) {
  }

  ionViewDidLoad() {
  }

  signin(){
    this.authService.login(this.userCredentials)
    .then((res:  any)=>{
      if(!res.code){
        this.navCtrl.setRoot("TabsPage");
      }
      else{
        alert(res);
        console.log("error logging in");
        console.log(res);
      }
    })

  }
}
