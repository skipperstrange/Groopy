import { Injectable } from '@angular/core';
import { FriendRequest } from '../../models/interfaces/friendRequestInterface';
import  firebase  from 'firebase';
import { Events } from 'ionic-angular';
import { UserProvider } from '../user/user';

/*
  Generated class for the RequestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestProvider {

  firedata = firebase.database().ref('/friendrequests')
  friendRequests
  constructor(public userService: UserProvider, public event: Events) {
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

  getFriendRequests(){
    let allRequests;
    var myRequests = [];
    this.firedata.child(firebase.auth().currentUser.uid).once('value', snapshot=>{
      allRequests = snapshot.val()
      for(var i in allRequests){
        myRequests.push(allRequests[i].sender)
      }
      this.userService.getAllUsers().then((res)=>{
        var users:any =res
          this.friendRequests = []
          for(var j in myRequests)
              for(var key in users){
                if(myRequests[j] === users[key].uid){
                  this.friendRequests.push(users[key])
                }
              }
             
        })
        
    })
      this.event.publish('gotFriendRequests')
  }


}
