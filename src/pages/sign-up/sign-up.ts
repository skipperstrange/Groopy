import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { userInterface } from "../../models/interfaces/userInterface";
import { UserProvider } from '../../providers/user/user';


/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  newUser = {} as userInterface;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider, public loaderCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  signin(){

    let loader = this.loaderCtrl.create({
      content: ""
    });

    loader.present();

   // if(this.newUser.email )

    this.userService.createUser(this.newUser).then((res: any)=>{
      if(res.success)
        this.navCtrl.push('ProfilePage')
      else
        alert(res)
    })

  }

  login(){
    this.navCtrl.pop();
  }

}
