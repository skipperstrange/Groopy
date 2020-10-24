import { Injectable} from '@angular/core';
import firebase from 'firebase'
import { ChatBuddy } from '../../models/interfaces/chatBuddy';
import { Events } from 'ionic-angular';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

  firechats = firebase.database().ref('/chats')
  buddy: ChatBuddy
  buddyMessages = [];

  constructor(public events: Events) {
    console.log('Hello ChatProvider Provider');
  }


  initializeBuddy(buddy){
    this.buddy = {
      uid: buddy.uid,
      displayName: buddy.displayName,
      photoURL: buddy.photoURL
    }
  }

  addNewMessage(msg = ''){
    if(this.buddy) {
      if(msg !== ''){
        var promise = new Promise ((resolve, reject) => {
        this.firechats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).push({
          sentby: firebase.auth().currentUser.uid,
          message: msg,
          status: "sent",
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.firechats.child(this.buddy.uid).child(firebase.auth().currentUser.uid).push({
            sentby: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          })
        })
      })
      return promise;
      }
    }
  }

  getBuddyMessages(){
    this.buddyMessages = []

    let temp;
    this.firechats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).on('value', (snapshot) => {
      this.buddyMessages = [];
      temp = snapshot.val();
      for(var tempkey in temp) {
        this.buddyMessages.push(temp[tempkey]);
      }
      this.events.publish('newmessage');
    })
  }

}
