import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { userInterface } from "../../models/interfaces/userInterface";
import { UserProvider } from '../../providers/user/user';
import { LoaderToasterProvider } from '../../providers/loader-toaster/loader-toaster';


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
    public loaderToaster: LoaderToasterProvider,
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
    this.loaderToaster.showLoading();

    if(this.newUser.displayName == undefined){
      this.loaderToaster.dismissLoading()
      this.loaderToaster.showToast("Display name cannot be empty");
      return;
    }
    else if( this.newUser.displayName.length < 3){
      this.loaderToaster.dismissLoading()
      this.loaderToaster.showToast("Display should at least 3 characters");
    }
    else if(this.newUser.email == undefined){
      this.loaderToaster.dismissLoading()
      this.loaderToaster.showToast("Email cannot be empty");
      return;
    }
    else if(this.newUser.password == undefined){
      this.loaderToaster.dismissLoading()
      this.loaderToaster.showToast("Password cannot be empty");
      return;
    } else {
      this.userService.createUser(this.newUser).then((res: any)=>{
        this.loaderToaster.dismissLoading()
        if(res.success){
        console.log(res)
          this.navCtrl.push('ProfilePicPage')
        }
      }).catch((err)=>{
        this.loaderToaster.dismissLoading()
        this.loaderToaster.showToast(err)
      })
    }

  }

  login(){
    this.navCtrl.pop();
  }

}
