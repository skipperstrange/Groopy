import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController  } from 'ionic-angular';
import { MediaHandlerProvider } from '../../providers/media-handler/media-handler';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ProfilePicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-pic',
  templateUrl: 'profile-pic.html',
})
export class ProfilePicPage {

  moveOn = true
  imgUrl: any

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public imageService: MediaHandlerProvider,
    public userService: UserProvider,
    public toastCtrl: ToastController,
    public loadCtrl: LoadingController,
    public zone: NgZone ) {
      this.imgUrl = ''
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProfilePicPage');
  }

  ionViewDidEnter(){
    this.imgUrl = "assets/imgs/defaultUser.png"
  }

  chooseImg(){

    const toast = this.toastCtrl.create({
      duration: 3000,
      showCloseButton: true,
    })

    const loader = this.loadCtrl.create({duration: 1000})
    loader.present()

    this.imageService.uploadImage().then((uploadedUrl: any)=>{
      this.zone.run(()=>{
        this.imgUrl = uploadedUrl
        this.moveOn = false
      })

      loader.dismiss()
      toast.setMessage("Successfully update profile image.")
    }).catch((err)=>{
      loader.dismiss()
      toast.setMessage(err)
      toast.present()
    })
  }


  proceed(){
    const loader = this.loadCtrl.create({duration: 1000})
    loader.present()
    this.navCtrl.setRoot('TabsPage')
  }

  updateProceed(){
    const loader = this.loadCtrl.create({duration: 1000})
    loader.present()

    const toast = this.toastCtrl.create({
      duration: 3000,
      showCloseButton: true,
    })

    this.userService.updateImage(this.imgUrl).then((res: any)=>{

      loader.dismiss()
      this.navCtrl.setRoot('TabsPage')
    }).catch((err)=>{
      loader.dismiss()
      toast.setMessage(err)
      toast.present()
    })

  }
}
