import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, ToastController, LoadingController} from 'ionic-angular';
import { RequestProvider } from '../../providers/request/request';
import { UserProvider } from '../../providers/user/user';
import { ChatProvider } from '../../providers/chat/chat';



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
  myFriends: any
  toast
  loader
  //requests = false

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public requestService: RequestProvider, public userService: UserProvider,
    public events: Events, public alertCtrl: AlertController,
    public toastCtrl: ToastController, public loaderCtrl: LoadingController,
    public chatService : ChatProvider) {

  }

  ngOnInit(){

  }

  ionViewWillEnter(){
    this.showLoading()
   this.loadRequests()
   this.loadFriends()
   this.dismissLoading()
  }

  ionDidLeaveView(){
    this.events.unsubscribe('gotFriendRequests')
    this.events.unsubscribe('gotFriends')
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
  })
  }

  loadFriends(){
    this.requestService.getFriends()
      this.events.subscribe('gotFriends', ()=>{
      this.myFriends = []
      this.myFriends =   this.requestService.myFriends
   //   this.requests = true
  })
  }

  acceptRequest(request){
    this.requestService.checkFriends(request).then((res)=>{
      this.showToasting("You are already buddies.")
    })
      .catch(()=>{
        this.requestService.acceptRequest(request).then(()=>{
          let sentUser = this.myRequests.indexOf(this.myRequests.reciever)
          this.myRequests.splice(sentUser,1)
          this.requestService.deleteRequest(request).then(()=>{
            let alert = this.alertCtrl.create({
            title: "New friend added!",
            message: "Tap on friend to chat",
            buttons: ['Ok']
          })
          alert.present()
          })
        })
        .catch((err)=>{
          console.log(err)
        })
      })
  }

  deleteRequest(request){
    this.requestService.deleteRequest(request).then(()=>{
      let sentUser = this.myRequests.indexOf(this.myRequests.reciever)
      this.myRequests.splice(sentUser,1)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  chatBuddy(friend){
    this.chatService.initializeBuddy(friend)
    this.navCtrl.push('ChatPage')
  }



  showLoading() {
    if(!this.loader){
        this.loader = this.loaderCtrl.create({
          content: "",
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


  showToasting(msg){

    if(!this.toast){
      this.toast = this.toastCtrl.create({
        duration: 5000,
        showCloseButton: true,
        position: "bottom"
      })
      this.toast.setMessage(msg)
      this.toast.present();
      this.toast = null;
    }
  }

}
