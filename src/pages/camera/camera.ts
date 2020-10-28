import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { ChatBuddy } from '../../models/interfaces/chatBuddy';
import { MediaHandlerProvider } from '../../providers/media-handler/media-handler';
import { LoaderToasterProvider } from '../../providers/loader-toaster/loader-toaster';

/**
 * Generated class for the CameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  cameraImage: any
  buddy: ChatBuddy

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public chatService: ChatProvider, public mediaService: MediaHandlerProvider,
    public loaderToaster: LoaderToasterProvider) {
      this.buddy = this.chatService.buddy
      console.log(this.buddy)

      this.getImage()

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }


  getImage(){
    this.mediaService.getCameraImage().then((imgUrl)=>{
      this.cameraImage = this.mediaService.cameraImageURI
      console.log(this.cameraImage)
    }).catch(err=>{
      this.loaderToaster.showToast(err)
    })
  }



  attachmentMsg(){
    this.loaderToaster.setDuration(2000)
    this.loaderToaster.showLoading()

  this.mediaService.cameraImageStore(this.mediaService.cameraImageURI).then((imgUrl: any) => {
    this.loaderToaster.dismissLoading();
     this.chatService.addNewMessage(imgUrl).then(() => {
      this.navCtrl.pop()
    })
  }).catch((err) => {

    this.loaderToaster.dismissLoading();
    this.loaderToaster.showToast("There was an error sending the media")
    setTimeout(()=>{
      this.navCtrl.pop()
    }, 3000)
  })
}

}
