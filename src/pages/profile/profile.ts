import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController  } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import firebase from 'firebase/app';

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
    public toastCtrl: ToastController, public loaderCtrl: LoadingController,
    public alertCtrl: AlertController){
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
      position: "bottom"
    });
    const loader = this.loaderCtrl.create({duration: 400});

   this.userService.getUserDetails().then((res: any)=>{
    this.displayName = res.displayName
    this.zone.run(()=>{
    this.avatar = res.photoURL
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
    const toast = this.toastCtrl.create({
      duration: 3000,
      showCloseButton: true,
      position: "bottom"
    });

    let alertStatus = this.alertCtrl.create({
      title: "Edit display Name",
      inputs: [{name: "displayName", placeholder: "Display Name", value: this.displayName}],
      buttons:[
        {text: "Cancel", role: "cancel", handler: data=>{}},
        {text: "Save", role: "cance;", handler: data=>{
            if(data.displayName){
              this.userService.updateiDisplayName(data.displayName)
              .then((res: any)=>{

                if(res.success){
                  console.log(res)
                  this.displayName = data.displayName
                  alertStatus.setTitle("Done!")
                  toast.setMessage("Your display name has been successfully updated.")
                  toast.present()
                }
                else{
                  alertStatus.setTitle("Failed!")
                  toast.setMessage("Could not save changes. Please try again later.")
                  toast.present()
                }
              })
              .catch((err)=>{
                  toast.setMessage(err)
                  toast.present()
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
