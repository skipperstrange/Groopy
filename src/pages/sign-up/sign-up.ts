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
  private regForm: FormGroup


  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserProvider, public toastCtrl: ToastController, public loaderCtrl: LoadingController,
    public formBuilder: FormBuilder) {
    this.regForm = formBuilder.group({
      email:['', [Validators.email, Validators.required]],
      password: ['', Validators.required, Validators.minLength(6)],
      displayName: ['', Validators.required, Validators.minLength(3)]
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  signup(){
    const toast = this.toastCtrl.create({
      duration: 5000,
      showCloseButton: true
    });
    const loader = this.loaderCtrl.create({
      content: "",
    });

    loader.present();

    if (!this.regForm.valid){
      console.log(this.regForm);
      console.log("Nice try!");
      loader.dismiss();
      toast.setMessage("There are erros. Please check and try again")
      toast.present()
    }else{
      this.userService.createUser(this.newUser).then((res: any)=>{
        if(res.success)
        loader.dismiss();
        console.log(res)
          this.navCtrl.push('ProfilePage')
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
