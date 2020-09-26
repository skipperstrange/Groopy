import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { menuInterface } from '../models/interfaces/menuInterface';

import { LoginPage } from '../pages/login/login';
import  firebase from 'firebase/app';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;
  menuTabIndex: number


  @ViewChild(Nav) nav: Nav

  pages: menuInterface[] = [
    {title: "Profile", pageName: "Profile", pageComponent: "ProfilePage", icon: "contact" },
    {title: "Categories", pageName: "Categories", pageComponent: "CategoriesPage", icon: "ion-list" },
    {title: "My Groups", pageName: "Groups", tabComponent: "GroupPage", tabIndex: 1, icon: "contacts" },
    {title: "My Settings", pageName: "Settings", pageComponent: "SettingsPage", icon: "ion-gear" },
  ]

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen
    ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();


    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  openPage(page: menuInterface){
    let params = {}

    if(page.tabIndex){ params = {tabIndex: page.tabIndex} }

    if(this.nav.getActiveChildNav() && page.tabIndex !== undefined){
      this.nav.setRoot(page.pageName, params)
    }
  }

  isActive(page: menuInterface){

  }

  logout(){
    firebase.auth().signOut().then(()=>{
      this.nav.setRoot("LoginPage");
    })
  }
}

