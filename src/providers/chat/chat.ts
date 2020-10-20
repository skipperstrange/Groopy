import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase'
import { ChatBuddy } from '../../models/interfaces/chatBuddy';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

  firechats = firebase.database().ref('/chats')
  buddy: ChatBuddy
  constructor(public http: HttpClient) {
    console.log('Hello ChatProvider Provider');
  }


  initializeBuddy(buddy){
    this.buddy = {
      uid: buddy.uid,
      displayName: buddy.displayName
    }
  }

  addnewmessage(msg){

  }

}
