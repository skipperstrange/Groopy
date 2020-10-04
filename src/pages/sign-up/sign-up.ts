import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
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
  public regForm: FormGroup

  loader
  toast = null


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userService: UserProvider,
    public toastCtrl: ToastController, public loaderCtrl: LoadingController,
    public formBuilder: FormBuilder) {
    this.regForm = formBuilder.group({
      email:['', [Validators.required]],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      displayName: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }



  signup(){
    this.showLoading();

    if(this.newUser.displayName == undefined){
      this.dismissLoading();
      this.showToasting("Display name cannot be empty");
      return;
    }
    else if( this.newUser.displayName.length < 3){
      this.dismissLoading();
      this.showToasting("Display should at least 3 characters");
    }
    else if(this.newUser.email == undefined){
      this.dismissLoading();
      this.showToasting("Email cannot be empty");
      return;
    }
    else if(this.newUser.password == undefined){
      this.dismissLoading();
      this.showToasting("Password cannot be empty");
      return;
    } else {
      this.userService.createUser(this.newUser).then((res: any)=>{
        this.dismissLoading();
        if(res.success){
        console.log(res)
          this.navCtrl.push('ProfilePicPage')
        }
      }).catch((err)=>{
        this.dismissLoading();
        this.showToasting(err)
      })
    }

  }

  login(){
    this.navCtrl.pop();
  }
  showLoading() {
    if(!this.loader){
        this.loader = this.loaderCtrl.create({
          content: "", duration:1000
        });
        this.loader.present();
    }
  }

  dismissLoading(){
    if(this.loader){
        this.loader.dismiss();
        this.loader = null;
    }
  }

    showToasting(msg){

      if(!this.toast){
        this.toast = this.toastCtrl.create({
          duration: 5000,
          showCloseButton: true,
          position: "bottom"
        })
        this.toast.setMessage(msg)
        this.toast.present();
        this.toast = null;
      }
    }

    dismissToasting(){
      if(this.toast){
          this.toast.dismiss();
          this.toast = null;
      }
    }

}
