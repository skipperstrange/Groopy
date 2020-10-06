import { Injectable } from '@angular/core';
import { FriendRequest } from '../../models/interfaces/friendRequestInterface';
import  firebase  from 'firebase';

/*
  Generated class for the RequestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestProvider {
  firedata = firebase.database().ref('/friendrequests')
  constructor( ) {
    console.log('Hello RequestProvider Provider');
  }

  
  sendFriendRequest(req: FriendRequest){

  var promise = new Promise((resolve, reject)=>{
    this.firedata.child(req.reciever).push({
      sender: req.sender
      })
      .then(()=>{
        resolve(true)
      })
      .catch(err=>{
        reject(false)
      })
    })
    return promise
  }


}
