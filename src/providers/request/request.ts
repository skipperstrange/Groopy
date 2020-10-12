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
  firefriends =  firebase.database().ref('/friend')
  friendRequests
  constructor(public userService: UserProvider, public event: Events) {
    console.log('Hello RequestProvider Provider');
  }


  sendFriendRequest(req: FriendRequest){
  var promise = new Promise((resolve, reject)=>{
    this.checkFriendsRequest(req).then((res: any)=>{
      console.log(res)
    })
    /*this.firedata.child(req.reciever).push({
      sender: req.sender
      })
      .then(()=>{
        resolve(true)
      })
      .catch(err=>{
        reject(false)
      })
      */
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

  acceptRequest(request){

    var promise:any = new Promise((resolve, reject)=>{
      this.firefriends.child(firebase.auth().currentUser.uid).push({
      uid: request.uid
    })
    .then(()=>{
      this.firefriends.child(request.uid).push({
        uid: firebase.auth().currentUser.uid
      })
    })
    .then(()=>{
      this.deleteRequest(request)
      .then(()=>{
        resolve(true)
      })
      .catch(err=>{
        reject(err)
        })
    })
    .catch(err=>{
      reject(err)
      })
    })

    return promise
  }

  deleteRequest(request){
    var promise = new Promise((resolve, reject)=>{
      this.firedata.child(firebase.auth().currentUser.uid).orderByChild('sender').equalTo(request.uid ).once('value', snapshot=>{
      let tempStore = snapshot.val()
      console.log(tempStore)
      let key = Object.keys(tempStore)
      console.log(key)
      this.firedata.child(firebase.auth().currentUser.uid).child(key[0]).remove().then(()=>{
        console.log("deleting")

        this.deleteRequest(request).then(()=>{
          console.log("deleted")
          resolve(true)
        })
        .catch((err)=>{
          reject(err)
        })
      })
      .catch((err)=>{
        reject(err)
      })
    })
    .catch((err)=>{
      reject(err)
    })
    })
    return promise
  }

  checkFriendsRequest(request: FriendRequest){
    var promise = new Promise((resolve)=>{
    this.firedata.child(request.reciever).orderByChild('sender').once('value', snapshot=>{
      let key = Object.keys(snapshot.val())
      if(key[0] === request.sender){
        resolve(true)
      }else{
        resolve(false)
      }
      })
    })
    return promise
  }

}
