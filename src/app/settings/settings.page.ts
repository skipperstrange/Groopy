import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user: any = {};
  isBrowser = true;
  
  constructor(
    private loginService: LoginService,
    private fcm: FirebaseX,
    private platform: Platform,
    private loadingProvider: LoadingService
  ) { }

  ngOnInit() {
    this.user = this.loginService.getUser();
    this.isBrowser = this.platform.is('desktop');
  }

  changeNotification() {

    if (this.platform.is('desktop')) {
      this.user.isPushEnabled = false;
      this.loadingProvider.showToast("Notification only working on mobile device")
    }
    else {
      console.log(this.user.isPushEnabled);
      if (this.user.isPushEnabled == true) {
        //Registering for push notification
        this.fcm.hasPermission().then(hasPermission => {
          if (!hasPermission) {
            this.fcm.grantPermission().then(data => console.log(data));
          }
          else {
            this.fcm.getToken().then(token => {
              console.log(token);
              this.loginService.updateUser({ isPushEnabled: true, pushToken: token });
              this.user.isPushEnabled = true;
            }).catch(err => {
              console.log(err);
            });
            this.fcm.onTokenRefresh().subscribe(token => {
              console.log(token);
              this.loginService.updateUser({ isPushEnabled: true, pushToken: token });
            });
          }
        });
        this.fcm.onMessageReceived().subscribe(data => {
          console.log(data);
        });
      }
      else {
        this.user.isPushEnabled == false;
        this.loginService.updateUser({ isPushEnabled: false, pushToken: '' });
      }
    }
  }

}
