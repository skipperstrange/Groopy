import { Component } from '@angular/core';
import { IonicPage,  } from 'ionic-angular';
//import { menuInterface } from '../models/interfaces/menuInterface';


import { ChatsPage  } from '../chats/chats';
import { GroupsPage  } from '../groups/groups';
import { ProfilePage  } from '../profile/profile';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tabs = [
    { title: "Groups", root: GroupsPage, icon: "contacts" },
    { title: "Chats", root: ChatsPage, icon: "chatboxes" },
    { title: "Profile", root: ProfilePage, icon: "contact" }
  ];
*
 // var menuTabIndex

  constructor() {
  //  this.menuTabIndex = this.navParams.data.tabIndex || 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  isActive(page){

  }

}
