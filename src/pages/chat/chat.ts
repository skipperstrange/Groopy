import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { ChatBuddy } from '../../models/interfaces/chatBuddy';
import firebase from  'firebase'
import { MediaHandlerProvider } from '../../providers/media-handler/media-handler';
import { LoaderToasterProvider } from '../../providers/loader-toaster/loader-toaster';

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
    public zone: NgZone, public mediaService: MediaHandlerProvider,
    public loaderToaster: LoaderToasterProvider, ) {
    this.buddy = this.chatService.buddy
    this.photoURL = firebase.auth().currentUser.photoURL
    this.events.subscribe('newmessage', () => {
      this.conversation = [];
      this.imgOrNot = [];
      this.zone.run(() => {
        this.conversation = this.chatService.buddyMessages;
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
      this.content.scrollToBottom(300)
    }, 200)
  }


    cameraMsg(){
      this.navCtrl.push("CameraPage")
    }

    attachmentMsg(){
      this.loaderToaster.setDuration(2000)
      this.loaderToaster.showLoading()

    this.mediaService.picMsgStore().then((imgUrl) => {
      this.loaderToaster.dismissLoading();
       this.chatService.addNewMessage(imgUrl).then(() => {
        this.content.scrollToBottom();
        this.newmessage = '';
      })
    }).catch((err) => {

      this.loaderToaster.dismissLoading();
    })
  }

}
