import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController  } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import firebase from 'firebase/app';
import { MediaHandlerProvider } from '../../providers/media-handler/media-handler';
import { LoaderToasterProvider } from '../../providers/loader-toaster/loader-toaster';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  avatar: any
  displayName: any
  loader
  toast

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userService: UserProvider, public zone: NgZone,
    public loaderToaster: LoaderToasterProvider,
    public alertCtrl: AlertController, public imageService: MediaHandlerProvider){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter(){
    this.loadUserDetails()
  }

  loadUserDetails(){
    this.loaderToaster.showLoading()

   this.userService.getUserDetails().then((res: any)=>{
     this.loaderToaster.dismissLoading()
    this.displayName = res.displayName
    this.zone.run(()=>{
    this.avatar = res.photoURL
    })
   })
   .catch((err)=>{
    this.loaderToaster.dismissLoading()
  })
  }

  editImage(){



    this.imageService.uploadImage().then((uploadedUrl: any)=>{
      this.userService.updateImage(uploadedUrl).then((res: any)=>{
        if(res.success){
          this.zone.run(()=>{
            this.avatar = uploadedUrl
          })
          this.loaderToaster.showToast("Successfully update profile image.")
        }
      })
      .catch((err)=>{
        this.loaderToaster.showToast(err)

      })
    })
    .catch((err)=>{
      this.loaderToaster.showToast(err)
    })
  }

  editDisplayName(){


    let alertStatus = this.alertCtrl.create({
      title: "Edit display Name",
      inputs: [{name: "displayName", placeholder: "Display Name", value: this.displayName}],
      buttons:[
        {text: "Cancel", role: "cancel", handler: data=>{}},
        {text: "Save", role: "cancel", handler: data=>{
            if(data.displayName){
              this.userService.updateDisplayName(data.displayName)
              .then((res: any)=>{
                if(res.success){
                  this.displayName = data.displayName
                  alertStatus.setTitle("Done!")
                  this.loaderToaster.showToast("Your display name has been successfully updated.")
                }
                //else{
                 //
                 // this.loaderToaster.showToast("Could not save changes. Please try again later.")
                 //
               // }
              })
              .catch((err)=>{
                this.loaderToaster.showToast(err)
              })
            }
          }
        }
      ]
    })
    alertStatus.present()

  }

  logout(){
    firebase.auth().signOut().then(()=>{
      this.navCtrl.parent.parent.setRoot("LoginPage");
    })
  }


}
