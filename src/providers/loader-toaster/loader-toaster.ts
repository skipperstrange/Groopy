import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';

/*
  Generated class for the LoaderToasterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoaderToasterProvider {
  loader
  toast
  options  = {content: "",duration: 0}
  position: "top"

  constructor( public toastCtrl: ToastController, public loaderCtrl: LoadingController) {
    console.log('Hello LoaderToasterProvider Provider');
    this.setContent("")
    this.setDuration(5000)
  }



  showLoading() {
    if(!this.loader){
        this.loader = this.loaderCtrl.create({
          content: this.options.content,
          duration: this.options.duration
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


  showToast(msg: string){
    if(msg){
    this.setContent(msg)
    }
    if(!this.toast){
      this.toast = this.toastCtrl.create({
        message: this.options.content,
        duration: this.options.duration,
        showCloseButton: true,
        position: this.position
      })
      this.toast.present();
      this.toast = null;
    }
  }

  setContent(content: string){
    this.options.content = content
  }

  setDuration(duration: number){
    this.options.duration = duration
  }

  setPosition(position){
    this.position = position
  }

}
