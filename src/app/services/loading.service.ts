import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loading;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  show() {
    if (!this.loading) {
      this.loadingCtrl.create({ spinner: 'circles', duration: 2000 }).then(res => {
        this.loading = res;
        this.loading.present();
      })
    }

  }
  hide() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  showToast(message) {
    this.toastCtrl.create({ message: message, duration: 3000 }).then(r => r.present())
  }
}
