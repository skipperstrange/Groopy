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
    const toast = this.toastCtrl.create({
      duration: 5000,
      showCloseButton: true,
      position: "top"
    });
    const loader = this.loaderCtrl.create({
      content: "",
    });

    loader.present();

    if(this.newUser.displayName == undefined){
      loader.dismiss();
      toast.setMessage("Display name cannot be empty")
      toast.present();
      return;
    }
    else if( this.newUser.displayName.length < 3){
      loader.dismiss();
      toast.setMessage("Display should at least 3 characters")
      toast.present();
    }
    else if(this.newUser.email == undefined){
      loader.dismiss();
      toast.setMessage("Email cannot be empty")
      toast.present();
      return;
    }
    else if(this.newUser.password == undefined){
      loader.dismiss();
      toast.setMessage("Password cannot be empty")
      toast.present();
      return;
    } else {
      this.userService.createUser(this.newUser).then((res: any)=>{
        if(res.success)
        loader.dismiss();
        console.log(res)
          this.navCtrl.push('ProfilePicPage')
      }).catch((err)=>{
        loader.dismiss();
        toast.setMessage(err)
        toast.present()

      })
    }

  }

  login(){
    this.navCtrl.pop();
  }

}
