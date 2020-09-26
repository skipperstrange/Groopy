import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';



@Injectable()
export class UserProvider {

  private firedata = firebase.database().ref('/users')
  //private defaultProfilePic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAHBAMAAADzDtBxAAAAD1BMVEUAAAAAAAAAAAAAAAAAAABPDueNAAAABXRSTlMUCS0gBIh/TXEAAAAaSURBVAjXYxCEAgY4UIICBmMogMsgFLtAAQCNSwXZKOdPxgAAAABJRU5ErkJggg=='
  private defaultProfilePic =  "https://www.pngitem.com/pimgs/m/146-1468843_profile-icon-orange-png-transparent-png.png"
  constructor(public aFireAuth : AngularFireAuth) {
   // console.log('Hello UserProvider Provider');
  }


  createUser(newUser){

    var promise = new Promise((resolve, reject)=>{
        this.aFireAuth.auth.createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(()=>{
          this.aFireAuth.auth.currentUser.updateProfile({
            displayName: newUser.displayName,
            photoURL: this.defaultProfilePic
          }).then(()=>{
            this.firedata.child(this.aFireAuth.auth.currentUser.uid).set({
              uid: this.aFireAuth.auth.currentUser.uid,
              displayName: newUser.displayName,
              photoURL: this.defaultProfilePic
            }).then(()=> {
              resolve({success: true})
            }).catch((err) => {
              reject(err);
            })
          }).catch((err) => {
            reject(err);
          })
        }).catch((err) => {
          reject(err);
        })
      })

      return promise;
  }

  passwordResetWithEmail(email){

    var promise = new Promise((resolve, reject)=>{
      firebase.auth().sendPasswordResetEmail(email)
        .then(()=>{
          resolve({success: true})
        })
        .catch((err)=>{
          reject(err)
        })
    })
    return promise
  }


  updateImage(imageUrl){
    var promise = new Promise((resolve, reject)=>{
      this.aFireAuth.auth.currentUser.updateProfile({
        displayName: this.aFireAuth.auth.currentUser.displayName,
        photoURL: imageUrl,
      }).then(()=>{
        firebase.database().ref('/users/'+firebase.auth().currentUser.uid).update({
          photoURL: imageUrl,
          uid: firebase.auth().currentUser.uid
        })
        .then(()=>{
          resolve({success: true})
        })
        .catch((err)=>{
          reject(err)
        })
      })
      .catch((err)=>{
        reject(err)
      })
    });

    return promise;
  }

  getUserDetails(){
    var promise = new Promise((resolve, reject)=>{
      this.firedata.child(firebase.auth().currentUser.uid).once('value', (snapshot)=>{
        resolve(snapshot.val())
      })
      .catch((err)=>{
        reject(err)
      })
    });

    return promise;
  }

  getUserDefaultProfilePic(){
    return this.defaultProfilePic
  }

  updateiDisplayName(newName){
    var promise = new Promise((resolve, reject)=>{
      this.aFireAuth.auth.currentUser.updateProfile({
        displayName: newName,
        photoURL: this.aFireAuth.auth.currentUser.photoURL,
      })
      .then(()=>{
        this.firedata.child(this.aFireAuth.auth.currentUser.uid).set({
          displayName: newName,
          photoURL: this.aFireAuth.auth.currentUser.photoURL,
          uid: firebase.auth().currentUser.uid
        })
        .then(()=>{
          resolve({success:true})
        })
        .catch((err)=>{
          reject(err)
        })
      })
      .catch((err)=>{
        reject(err)
      })
    });
    return promise
  }


}
