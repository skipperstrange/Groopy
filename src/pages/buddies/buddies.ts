import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController  } from 'ionic-angular';
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
  foundBuddies = [] 
  disableSearch = true
  Buddies : any
  startAt = new Subject()
  endAt = new Subject()
  startAtObs = this.startAt.asObservable()
  endAtObs = this.endAt.asObservable()
  lastKeyPress = 0
  toast
  myId
  reqGoAhead
 
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public userService: UserProvider, public toastCtrl: ToastController,public alertCtrl: AlertController, public requestService: RequestProvider  ) {
      this.initializeBuddies()
      this.myId = firebase.auth().currentUser.uid;
      this.reqGoAhead = false
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuddiesPage');
  }

  ngOnInit(){
  }

  initializeBuddies(){
    this.Buddies = []
    this.userService.getAllUsers().then(res=>{
      this.Buddies =res
    })
    .then(()=>{
      this.disableSearch = false
      console.log("Loaded buddies")
    })
    .catch((err)=>{
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
    
   if(this.friendRequest.sender == this.friendRequest.reciever){
    this.toast = this.toastCtrl.create({
      duration: 3000,
      showCloseButton: true,
      message: "Sorry. Can't send a request to yourself!!"
    });
    this.toast.present();
    return
   }else{
     
     let  reqAlert = this.alertCtrl.create({
     title: "Friend request.",
     message:'Request will be sent to '+buddy.displayName,
     buttons: [
       {
         text: "Send", role: "save", handler: data=>{
          console.log(this.reqGoAhead)
            this.toast = this.toastCtrl.create({
            duration: 3000,
            showCloseButton: true,
          })
    
           this.requestService.sendFriendRequest(this.friendRequest)
           .then(()=>{
             let sentUser = this.foundBuddies.indexOf(this.friendRequest.reciever)
             this.foundBuddies.splice(sentUser,1)
            this.toast.setMessage("Request sent to "+buddy.displayName)
            this.toast.present();
           })
           .catch(err=>{
             this.toast.setMessage("Could not send. Please try later.")
            this.toast.present();
           })
          
          }
      },
        {text: "Cancel", role: 'cancel'}
     ]
     })
      console.log(this.reqGoAhead)
     reqAlert.present()
      
     }
   }                    
  }