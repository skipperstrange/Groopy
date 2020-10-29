import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';


/*
  Generated class for the GroupsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GroupsProvider {
  firegroup = firebase.database().ref('/groups');
  myGroups: Array<any> = [];
  currentGroup: Array<any> =[];
  currentGroupName;
  groupPic;
  groupMsgs;
constructor(public events: Events) {

}

  addGroup(newGroup) {
    var promise = new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(newGroup.groupName).set({
        groupImage: newGroup.groupPic,
        description: newGroup.description,
        msgboard: '',
        private: newGroup.private,
        owner: firebase.auth().currentUser.uid
      }).then(() => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  getmyGroups() {
    this.firegroup.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
      this.myGroups = [];
      if(snapshot.val() != null) {
        var temp = snapshot.val();
        for (var key in temp ) {
          let newgroup = {
            groupName: key,
            groupImage: temp[key].groupImage
          }
          this.myGroups.push(newgroup);
        }
      }
      this.events.publish('newgroup');
    })
  }

  getIntoGroup(groupName) {
    if (groupName != null) {
      this.firegroup.child(firebase.auth().currentUser.uid).child(groupName).once('value', (snapshot) => {
        if(snapshot.val() != null) {
          var temp = snapshot.val().members;
          this.currentGroup = [];
          for(var key in temp) {
            this.currentGroup.push(temp[key]);
          }
          this.currentGroupName = groupName;
          this.events.publish('gotintogroup');
        }
      })
    }
  }

  getOwnership(groupName) {
    var promise = new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(groupName).once('value', (snapshot) => {
        var temp = snapshot.val().owner;
        if(temp == firebase.auth().currentUser.uid) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  getGroupImage() {
    return new Promise((resolve, reject) => {
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).once('value', (snapshot) => {
        this.groupPic =snapshot.val().groupImage;
        resolve(true);
      })
    })
  }

  addMember(newMember) {
    this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).child('members').push(newMember).then(() => {
      this.getGroupImage().then(() => {
        this.firegroup.child(newMember.uid).child(this.currentGroupName).set({
          groupimage: this.groupPic,
          owner: firebase.auth().currentUser.uid,
          msgboard: ''
        }).catch((err) => {
          console.log(err);
        })
      })
      this.getIntoGroup(this.currentGroupName);
    })
  }

  deleteMember(member) {
    this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName)
      .child('members').orderByChild('uid').equalTo(member.uid).once('value', (snapshot) => {
        snapshot.ref.remove().then(() => {
          this.firegroup.child(member.uid).child(this.currentGroupName).remove().then(() => {
            this.getIntoGroup(this.currentGroupName);
          })
        })

      })
  }

  getGroupMembers() {
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).once('value', (snapshot) => {
        var tempdata = snapshot.val().owner;
        this.firegroup.child(tempdata).child(this.currentGroupName).child('members').once('value', (snapshot) => {
        var tempvar = snapshot.val();
          for(var key in tempvar) {
            this.currentGroup.push(tempvar[key]);
          }
        })
      })

      this.events.publish('gotmembers');
  }

leaveGroup() {
  var promise = new Promise((resolve, reject) => {
    this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).once('value', (snapshot) => {
      var tempowner = snapshot.val().owner;
      this.firegroup.child(tempowner).child(this.currentGroupName).child('members').orderByChild('uid')
        .equalTo(firebase.auth().currentUser.uid).once('value', (snapshot) => {
          snapshot.ref.remove().then(() => {
            this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).remove().then(() => {
              resolve(true);
            }).catch((err) => {
              reject(err);
            })
          }).catch((err) => {
            reject(err);
          })
        })
      })
    })
  return promise
}

deleteGroup() {
var promise = new Promise((resolve, reject) => {
    this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).child('members').once('value', (snapshot) => {
      var tempMembers = snapshot.val();
      for(var key in tempMembers) {
        this.firegroup.child(tempMembers[key].uid).child(this.currentGroupName).remove();
            }
            this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).remove().then(() => {
            resolve(true);
            }).catch((err) => {
          reject(err);
        })
      })
    })

  return promise
}

addGroupMsg(newMessage) {
    var promise = new Promise((resolve) => {
    this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).child('owner').once('value', (snapshot) => {
      var tempowner = snapshot.val();
      this.firegroup.child(firebase.auth().currentUser.uid).child(this.currentGroupName).child('msgboard').push({
        sentby: firebase.auth().currentUser.uid,
        displayName: firebase.auth().currentUser.displayName,
        photoURL: firebase.auth().currentUser.photoURL,
        message: newMessage,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        if(tempowner != firebase.auth().currentUser.uid) {
          this.firegroup.child(tempowner).child(this.currentGroupName).child('msgboard').push({
            displayName: firebase.auth().currentUser.displayName,
            photoURL: firebase.auth().currentUser.photoURL,
            message: newMessage,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          })
        }
        var tempMembers = [];
        this.firegroup.child(tempowner).child(this.currentGroupName).child('members').once('value', (snapshot) => {
          var tempMembersObj = snapshot.val();
          for(var key in tempMembersObj)
          tempMembers.push(tempMembersObj[key]);
        }).then(() => {
            let postedmsgs  = tempMembers.map((item) => {
            if(item.uid != firebase.auth().currentUser.uid) {
            return new Promise((resolve) => {
              this.postMsgs(item, newMessage, resolve)
            })
          }
        })
            Promise.all(postedmsgs).then(() => {
            this.getGroupMsgs(this.currentGroupName);
            resolve(true);
          })
        })
      })
    })
  })
}

  postMsgs(member, msg, cb) {
    this.firegroup.child(member.uid).child(this.currentGroupName).child('msgboard').push({
        sentby: firebase.auth().currentUser.uid,
        displayName: firebase.auth().currentUser.displayName,
        photoURL: firebase.auth().currentUser.photoURL,
        message: msg,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
      cb();
    })
  }

  getGroupMsgs(groupName) {
    this.firegroup.child(firebase.auth().currentUser.uid).child(groupName).child('msgboard').on('value', (snapshot) => {
      var tempMsgHolder = snapshot.val();
      this.groupMsgs= [];
      for (var key in tempMsgHolder)
      this.groupMsgs.push(tempMsgHolder[key]);
      this.events.publish('newgroupmsg');
    })
  }
}
