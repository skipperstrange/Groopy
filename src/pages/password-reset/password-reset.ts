import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';
/**
 * Generated class for the PasswordResetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordResetPage {

  public email
  public resetForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public loadCtrl: LoadingController,
    public formBuilder: FormBuilder, public userService: UserProvider) {
      this.resetForm = formBuilder.group({
        email:['', [Validators.email, Validators.required]]
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordResetPage');
  }

  resetPassword(){

    const toast = this.toastCtrl.create({
      duration: 5000,
      showCloseButton: true,
      position: "top"
    })

    const loader = this.loadCtrl.create({})
    loader.present()
    if(this.email == undefined){
      loader.dismiss()
      toast.setMessage("Email cannot be empty")
      toast.present();
      return;
    }else {

      this.userService.passwordResetWithEmail(this.email)
      .then((res: any)=>{
        if(res.success)
        loader.dismiss()
        toast.setMessage("Password recovery instructions have successfully been sent to "+ this.email)
        toast.present();
      }).catch((err)=>{
        loader.dismiss();
        toast.setMessage(err)
        toast.present()

      })
    }
  }


  login(){
    this.navCtrl.setRoot(LoginPage);
  }

}
