import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content,LoadingController, ToastController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { ChatBuddy } from '../../models/interfaces/chatBuddy';
import firebase from  'firebase'
import { MediaHandlerProvider } from '../../providers/media-handler/media-handler';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;

  newmessage: string
  buddy:ChatBuddy
  conversation
  displayName
  photoURL
  imgOrNot
  toast


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public chatService: ChatProvider,public events: Events,
    public zone: NgZone, public loadingCtrl: LoadingController,
    public mediaService: MediaHandlerProvider, public toastCtrl: ToastController, ) {
    this.buddy = this.chatService.buddy
    this.photoURL = firebase.auth().currentUser.photoURL
    this.events.subscribe('newmessage', () => {
      this.conversation = [];
      this.imgOrNot = [];
      this.zone.run(() => {
        this.conversation = this.chatService.buddyMessages;
        console.log(this.conversation)
        for(var key in this.conversation) {
          if(this.conversation[key].message.substring(0, 4) == 'http'){
          this.imgOrNot.push(true);
          }
          else{
          this.imgOrNot.push(false);
          }
        }
      })
      this.scrollToBottom()
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  ionViewDidEnter(){
    this.chatService.getBuddyMessages()
    this.scrollToBottom()
  }

  sendMsg(msg){
    if( this.newmessage || this.newmessage !== undefined){
      this.chatService.addNewMessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
      })
    }

  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(800)
    }, 400)
  }

  attachmentMsg(){
    let loader = this.loadingCtrl.create ({
    content: 'Please wait'
  });
  loader.present();
  this.mediaService.picMsgStore().then((imgurl) => {
    loader.dismiss();
     this.chatService.addNewMessage(imgurl).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }).catch((err) => {

    loader.dismiss();
  })
}


cameraMsg(){

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
