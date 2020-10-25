import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { userCreds } from '../../models/interfaces/usercreds';
import { LoaderToasterProvider } from '../../providers/loader-toaster/loader-toaster';

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
  public loginForm: FormGroup

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider,
     public formBuilder: FormBuilder,public loaderToaster: LoaderToasterProvider) {
    this.loginForm = formBuilder.group({
      email:['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    })
  }

  ionViewDidLoad() {
  }

  signin(){


     this.loaderToaster.showLoading()
    if(this.userCredentials.email == undefined){
      this.loaderToaster.dismissLoading()
      this.loaderToaster.showToast("Email cannot be empty")
    }
    else if(this.userCredentials.password == undefined){
      this.loaderToaster.dismissLoading()
      this.loaderToaster.showToast("Password cannot be empty")

    }
    else{
      this.loaderToaster.showLoading()
      this.authService.login(this.userCredentials)
      .then((res:  any)=>{
        if(!res.code){
          this.loaderToaster.dismissLoading()
          this.navCtrl.setRoot("TabsPage");
        }
      }).catch((err)=>{
        this.loaderToaster.dismissLoading()
        this.loaderToaster.showToast(err)
      });
    }
  }


  signup(){
    this.navCtrl.push("SignUpPage");
  }

  passwordReset(){
    this.navCtrl.push("PasswordResetPage");
  }
}
