import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
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
  public loginForm: FormGroup

  constructor(public navCtrl: NavController, public navParams: NavParams,
     public toastCtrl: ToastController, public loadCtrl: LoadingController, public authService: AuthProvider,
     public formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email:['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    })
  }

  ionViewDidLoad() {
  }

  signin(){
    const toast = this.toastCtrl.create({
      duration: 5000,
      showCloseButton: true,
      position: "top"
    })

    const loader = this.loadCtrl.create({})

    if(this.userCredentials.email == undefined){
      toast.setMessage("Email cannot be empty")
      toast.present();
      return;
    }else if(this.userCredentials.password == undefined){
      toast.setMessage("Password cannot be empty")
      toast.present();
      return;
    }else{
      loader.present();
      this.authService.login(this.userCredentials)
      .then((res:  any)=>{
        if(!res.code){
          loader.dismiss()
          this.navCtrl.setRoot("TabsPage");
        }
      }).catch((err)=>{
        loader.dismiss();
      toast.setMessage(err)
      toast.present();
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
