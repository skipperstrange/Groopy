import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content,LoadingController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { ChatBuddy } from '../../models/interfaces/chatBuddy';
import firebase from  'firebase'

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


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public chatService: ChatProvider,public events: Events,
    public zone: NgZone, public loadCtrl: LoadingController ) {
    this.buddy = this.chatService.buddy
    this.photoURL = firebase.auth().currentUser.photoURL
    this.events.subscribe('newmessage', () => {
      this.conversation = [];
      this.imgOrNot = [];
      this.zone.run(() => {
        this.conversation = this.chatService.buddyMessages;
        console.log(this.conversation)
        for(var key in this.conversation) {
          if(this.conversation[key].message.substring(0, 4) == 'http')
          this.imgOrNot.push(true);
          else
          this.imgOrNot.push(false);
        }
        this.content.scrollToBottom()
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  ionViewDidEnter(){
    this.chatService.getBuddyMessages()
  }

  sendMsg(msg){
    if(this.newmessage.length > 0 || !this.newmessage || this.newmessage !== undefined){
      this.chatService.addnewmessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
      })
    }

  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

}
