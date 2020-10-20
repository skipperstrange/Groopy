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
  firefriends =  firebase.database().ref('/friends')
  friendRequests
  myFriends
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
    })
    return promise
  }

  getFriendRequests(){
    let allmyrequests;
    var myrequests = [];
    this.firedata.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      allmyrequests = snapshot.val();
      myrequests = [];
      for(var i  in allmyrequests) {
        myrequests.push(allmyrequests[i].sender);
      }
      this.userService.getAllUsers().then((res: any) => {
        var allusers = res;
        this.friendRequests = [];
        for (var j in myrequests)
        for (var key in allusers) {
          if(myrequests[j] === allusers[key].uid) {
          this.friendRequests.push(allusers[key]);
        }
      }
        this.event.publish('gotFriendRequests')
      })

    })

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
          let key = Object.keys(tempStore)
            this.firedata.child(firebase.auth().currentUser.uid).child(key[0]).remove().then(()=>{
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
    return promise
  }

  checkFriendRequest(request: FriendRequest){

    var promise = new Promise((resolve, reject)=>{
    this.firedata.child(request.reciever).orderByChild('sender').once('value', snapshot=>{

      if(!snapshot.exists()){
        reject(false)
      }else{
        let tempArr = snapshot.val()
        let key
        key = Object.keys(tempArr)

        if(tempArr[key[0]].sender === request.sender){
          resolve(true)
        }
      }

      })
      .catch(err=>{
        reject(false)
      })
    })
    return promise
  }

  checkFriends(request: FriendRequest){

    var promise = new Promise((resolve, reject)=>{
      this.firefriends.child(firebase.auth().currentUser.uid).orderByChild('uid').once('value', snapshot=>{


        if(snapshot.exists()){
              let tempArr = snapshot.val()
              let friends = []

              for(var h in tempArr){
                friends.push(tempArr[h].uid)
              }

              for(var i in friends){
              if(friends[i] == request.reciever){
                resolve(true)
              }else{
                reject(false)
              }
            }
            }else{
              reject(false)
            }
          })
          .catch(()=>{
            console.log(false)
            reject(false)
          })
    })
    return promise
  }

  getFriends(){
      let friendsUid = []
      let allFriends
        this.firefriends.child(firebase.auth().currentUser.uid).on('value', (snapshot)=>{
          allFriends = snapshot.val()

          for(var i in allFriends){
            friendsUid.push(allFriends[i].uid)
          }

          this.userService.getAllUsers().then(users=>{
            this.myFriends = []
          for(var j in friendsUid){
              for(var key in users){
                if(friendsUid[j] == users[key].uid){
                  console.log(friendsUid[j])
                  this.myFriends.push(users[key])
                }
              }
            this.event.publish('gotFriends')
          }

        }).catch(err=>{
          console.log(err)
        })
        })

      }

}
