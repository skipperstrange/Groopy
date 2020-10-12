import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { RequestProvider } from '../../providers/request/request';
import { UserProvider } from '../../providers/user/user';



/**
 * Generated class for the ChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  searchChats : string
  myRequests: any

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public requestService: RequestProvider, public userService: UserProvider,
    public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatsPage');
  }

  ionViewWillEnter(){
  this.requestService.getFriendRequests() 
      this.events.subscribe('gotFriendRequests', ()=>{
      this.myRequests = []
      this.myRequests =   this.requestService.friendRequests 
      console.log(this.myRequests)
  })
  }

  ionDidLeaveView(){
    this.events.unsubscribe('gotFriendRequests')
  }


  addBuddy(){
    this.navCtrl.push('BuddiesPage')
  }

  search($e){
    
  }

}
  