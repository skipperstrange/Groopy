import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs/Rx";
import { UserProvider } from '../../providers/user/user';
import { RequestProvider } from "../../providers/request/request";
import { FriendRequest } from '../../models/interfaces/friendRequestInterface';
import firebase from 'firebase';


/**
 * Generated class for the BuddiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {

  friendRequest = {} as FriendRequest;
  reverseFriendRequest = {} as FriendRequest;
  foundBuddies = []
  disableSearch = true
  Buddies : any
  startAt = new Subject()
  endAt = new Subject()
  startAtObs = this.startAt.asObservable()
  endAtObs = this.endAt.asObservable()
  lastKeyPress = 0
  toast = null
  loader
  myId

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userService: UserProvider, public toastCtrl: ToastController,
    public alertCtrl: AlertController, public requestService: RequestProvider,
    public loaderCtrl: LoadingController  ) {
      this.initializeBuddies()
      this.myId = firebase.auth().currentUser.uid;
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


  ionViewDidLoad() {
    console.log('ionViewDidLoad BuddiesPage');
  }

  ngOnInit(){
  }

  initializeBuddies(){
    this.Buddies = []
    this.showLoading()
    this.userService.getAllUsers().then(res=>{
      this.Buddies =res
      this.dismissLoading()
    })
    .then(()=>{
      this.disableSearch = false
      this.dismissLoading()
    })
    .catch((err)=>{
      this.dismissLoading()
      console.log(err)
    });
  }

   search($event){

      let q = $event.target.value
      if(!q || q == ''){
        this.foundBuddies =[]
        return
      }
    if(($event.timeStamp - this.lastKeyPress) > 200){

      this.foundBuddies = this.Buddies.filter(buddy => {
        if(buddy && q){
        return (buddy.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1)
        }
      })

    }
    this.lastKeyPress = $event.timeStamp
  }

  sendReq(buddy){
   this.friendRequest.sender = this.myId;
   this.friendRequest.reciever = buddy.uid;

   this.reverseFriendRequest.sender = buddy.uid;
   this.reverseFriendRequest.reciever = this.myId;

   if(this.friendRequest.sender == this.friendRequest.reciever){
    this.showToasting("Sorry. Can't send a request to yourself!!")
   }else{

         let  reqAlert = this.alertCtrl.create({
         title: "Friend request.",
         message:'Request will be sent to '+buddy.displayName,
         buttons: [
           {
             text: "Send", role: "save", handler: data=>{

               this.requestService.sendFriendRequest(this.friendRequest)
               .then(()=>{
                 let sentUser = this.foundBuddies.indexOf(this.friendRequest.reciever)
                 this.foundBuddies.splice(sentUser,1)
                this.showToasting("Request sent to "+buddy.displayName)
               })
               .catch(err=>{
                 this.showToasting(err)
               })

              }
          },
            {text: "Cancel", role: 'cancel'}
         ]
         })

         this.requestService.checkFriends(this.friendRequest).then((res)=>{
          console.log("Already buddies "+res)
          this.showToasting("You are already buddies with " + buddy.displayName+".")
        })
          .catch(()=>{
              this.requestService.checkFriendRequest(this.reverseFriendRequest).then((res)=>{
              this.showToasting("You already have a pending request from this uer.")
            })
                .catch(()=>{
                  this.requestService.checkFriendRequest(this.friendRequest).then((res)=>{
                  this.showToasting("Already sent request.")
                })
                    .catch(()=>{
                      reqAlert.present()
                    })
        })

        })
     }
   }

   goBack(){
     this.navCtrl.pop()
   }
  }
