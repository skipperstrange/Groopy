import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController  } from 'ionic-angular';
import { MediaHandlerProvider } from '../../providers/media-handler/media-handler';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  avatar: any
  displayName: any

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userService: UserProvider, public zone: NgZone,
    public toastCtrl: ToastController, public loaderCtrl: LoadingController){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter(){
    this.loadUserDetails()
  }

  loadUserDetails(){
    const toast = this.toastCtrl.create({
      duration: 3000,
      showCloseButton: true,
      position: "top"
    });
    const loader = this.loaderCtrl.create({duration: 400});

   this.userService.getUserDetails().then((res: any)=>{
    this.zone.run(()=>{
    this.avatar = res.photoURL
    console.log(res)
    this.displayName = res.displayName
    })
   })
   .catch((err)=>{
    loader.dismiss()
    toast.setMessage(err)
    toast.present()
  })
  }

  editImage(){

  }

  editDisplayName(){

  }

  logout(){

  }

}
