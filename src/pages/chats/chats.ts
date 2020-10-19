import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
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
  //requests = false

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public requestService: RequestProvider, public userService: UserProvider,
    public events: Events, public alertCtrl: AlertController) {

  }

  ngOnInit(){

  }

  ionViewWillEnter(){
   this.loadRequests()
  }

  ionDidLeaveView(){
    this.events.unsubscribe('gotFriendRequests')
  }


  addBuddy(){
    this.navCtrl.push('BuddiesPage')
  }

  search($e){

  }

  loadRequests(){
    this.requestService.getFriendRequests()
      this.events.subscribe('gotFriendRequests', ()=>{
      this.myRequests = []
      this.myRequests =   this.requestService.friendRequests
   //   this.requests = true
      console.log(this.myRequests)
  })
  }

  acceptRequest(request){
    this.requestService.acceptRequest(request).then(()=>{
      let alert = this.alertCtrl.create({
        title: "New friend added!",
        message: "Tap on friend to chat",
        buttons: ['Ok']
      })
      alert.present()
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  deleteRequest(request){
    this.requestService.deleteRequest(request).then(()=>{

    })
    .catch((err)=>{
      console.log(err)
    })
  }

}
