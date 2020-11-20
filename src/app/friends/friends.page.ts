import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { LoadingService } from '../services/loading.service';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  friends: any;
  friendRequests: any = [];
  searchFriend: any;
  tab: any;
  title: any;
  requestsSent: any = [];
  friendRequestCount = 0;

  alert: any;
  account: any;

  accounts: any = [];
  excludedIds: any = [];
  searchUser: any;

  isLoading;

  // FriendsPage
  // This is the page where the user can search, view, and initiate a chat with their friends.
  constructor(
    private dataProvider: DataService,
    private alertCtrl: AlertController,
    private firebaseProvider: FirebaseService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.tab = "friends";
    this.title = "Friends";

    this.searchFriend = '';
    if (this.afAuth.auth.currentUser != null) {
      this.dataProvider.getRequests(this.afAuth.auth.currentUser.uid).snapshotChanges().subscribe((requestsRes: any) => {
        let requests = requestsRes.payload.val();
        console.log(requests);
        if (requests != null) {
          if (requests.friendRequests != null && requests.friendRequests != undefined)
            this.friendRequestCount = requests.friendRequests.length;
          else this.friendRequestCount = 0
        }
        else this.friendRequestCount = 0;
        console.log(this.friendRequestCount);
      });
      this.getFriends();
    }


  }

  segmentChanged($event) {
    if (this.tab == 'friends') {
      this.title = "Friends"; this.getFriends();
    }
    else if (this.tab == 'requests') {
      this.title = "Friend Requests"; this.getFriendRequests();
    }
    else if (this.tab == 'search') {
      this.title = "Find New Friends";
    }
  }

  getFriends() {

    this.isLoading = true;
    this.friends = [];
    // Get user data on database and get list of friends.
    this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account: any) => {
      console.log(account);
      this.isLoading = false;
      if (account.payload.val() != null && account.payload.val().friends != null) {
        for (var i = 0; i < account.payload.val().friends.length; i++) {
          this.dataProvider.getUser(account.payload.val().friends[i]).snapshotChanges().subscribe((friend: any) => {
            if (friend.key != null) {
              let friendData = { $key: friend.key, ...friend.payload.val() };
              this.addOrUpdateFriend(friendData);
            }
          });
        }
      } else {
        this.friends = [];
      }

    });
  }

  // Add or update friend data for real-time sync.
  addOrUpdateFriend(friend) {
    console.log(friend)
    if (!this.friends) {
      this.friends = [friend];
    } else {
      var index = -1;
      for (var i = 0; i < this.friends.length; i++) {
        if (this.friends[i].$key == friend.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.friends[index] = friend;
      } else {
        this.friends.push(friend);
      }
    }
    console.log(this.friends);
  }

  // Proceed to userInfo page.
  viewUser(userId) {
    console.log(userId);
    this.router.navigateByUrl('/userinfo/' + userId);
  }

  // Proceed to chat page.
  message(userId) {
    this.router.navigateByUrl('/message/' + userId);
  }


  // Manageing Friend Requests

  getFriendRequests() {
    this.friendRequests = [];
    this.requestsSent = [];
    this.isLoading = true;
    // Get user info
    this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {
      this.account = account.payload.val();
      console.log(this.account);
      // Get friendRequests and requestsSent of the user.
      this.dataProvider.getRequests(this.account.userId).snapshotChanges().subscribe((requestsRes: any) => {
        // friendRequests.
        let requests = requestsRes.payload.val();
        if (requests != null) {
          if (requests.friendRequests != null && requests.friendRequests != undefined) {
            this.friendRequests = [];
            this.friendRequestCount = requests.friendRequests.length;
            requests.friendRequests.forEach((userId) => {
              this.dataProvider.getUser(userId).snapshotChanges().subscribe((sender: any) => {
                sender = { $key: sender.key, ...sender.payload.val() };
                this.addOrUpdateFriendRequest(sender);
              });
            });
          } else {
            this.friendRequests = [];
          }
          // requestsSent.
          if (requests.requestsSent != null && requests.requestsSent != undefined) {
            this.requestsSent = [];
            requests.requestsSent.forEach((userId) => {
              this.dataProvider.getUser(userId).snapshotChanges().subscribe((receiver: any) => {
                receiver = { $key: receiver.key, ...receiver.payload.val() };
                this.addOrUpdateRequestSent(receiver);
              });
            });
          } else {
            this.requestsSent = [];
          }
        }
        this.isLoading = false;
      });
    });
  }



  // Add or update friend request only if not yet friends.
  addOrUpdateFriendRequest(sender) {
    if (!this.friendRequests) {
      this.friendRequests = [sender];
    } else {
      var index = -1;
      for (var i = 0; i < this.friendRequests.length; i++) {
        if (this.friendRequests[i].$key == sender.$key) {
          index = i;
        }
      }
      if (index > -1) {
        if (!this.isFriends(sender.$key))
          this.friendRequests[index] = sender;
      } else {
        if (!this.isFriends(sender.$key))
          this.friendRequests.push(sender);
      }
    }
  }

  // Add or update requests sent only if the user is not yet a friend.
  addOrUpdateRequestSent(receiver) {
    if (!this.requestsSent) {
      this.requestsSent = [receiver];
    } else {
      var index = -1;
      for (var j = 0; j < this.requestsSent.length; j++) {
        if (this.requestsSent[j].$key == receiver.$key) {
          index = j;
        }
      }
      if (index > -1) {
        if (!this.isFriends(receiver.$key))
          this.requestsSent[index] = receiver;
      } else {
        if (!this.isFriends(receiver.$key))
          this.requestsSent.push(receiver);
      }
    }
  }


  findNewFriends() {
    if (this.searchUser.length > 0) {

      this.requestsSent = [];
      this.friendRequests = [];

      this.dataProvider.searchUser(this.searchUser).snapshotChanges().subscribe((accounts: any) => {
        // applying Filters

        let acc = accounts.filter((c) => {
          if (c.key == null && c.key == undefined && c.payload.val() == null) return false;
          if (c.payload.val().name == '' || c.payload.val().name == ' ' || c.payload.val().name == undefined) return false;
          if (c.payload.val().publicVisibility == false) return false;
          return true;
        });

        this.accounts = acc.map(c => {
          return { $key: c.key, ...c.payload.val() }
        })


        this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account: any) => {
          // Add own userId as exludedIds.
          // console.log(account.payload.val());
          this.excludedIds = [];
          this.account = account.payload.val();
          if (this.excludedIds.indexOf(account.key) == -1) {
            this.excludedIds.push(account.key);
          }
          // Get friends which will be filtered out from the list using searchFilter pipe pipes/search.ts.
          if (account.payload.val() != null) {
            // console.log(account.payload.val().friends);
            if (account.payload.val().friends != null) {
              account.payload.val().friends.forEach(friend => {
                if (this.excludedIds.indexOf(friend) == -1) {
                  this.excludedIds.push(friend);
                }
              });
            }
          }
          // Get requests of the currentUser.
          this.dataProvider.getRequests(account.key).snapshotChanges().subscribe((requests: any) => {
            if (requests.payload.val() != null) {
              this.requestsSent = requests.payload.val().requestsSent;
              this.friendRequests = requests.payload.val().friendRequests;
            }
          });
        });

      });
    }
    else {
      this.accounts = [];
    }
  }

  // Send friend request.
  sendFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      header: 'Send Friend Request',
      message: 'Do you want to send friend request to <b>' + user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Send',
          handler: () => {
            this.firebaseProvider.sendFriendRequest(user.$key);
          }
        }
      ]
    }).then(r => r.present());
  }

  // Accept Friend Request.
  acceptFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      header: 'Confirm Friend Request',
      message: 'Do you want to accept <b>' + user.name + '</b> as your friend?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Reject Request',
          handler: () => {
            this.firebaseProvider.deleteFriendRequest(user.$key);
            this.getFriendRequests();
          }
        },
        {
          text: 'Accept Request',
          handler: () => {
            this.firebaseProvider.acceptFriendRequest(user.$key);
            this.getFriendRequests();
          }
        }
      ]
    }).then(r => r.present());
  }

  // Cancel Friend Request sent.
  cancelFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      header: 'Friend Request Pending',
      message: 'Do you want to delete your friend request to <b>' + user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Delete',
          handler: () => {
            this.firebaseProvider.cancelFriendRequest(user.$key);
            this.getFriendRequests();
          }
        }
      ]
    }).then(r => r.present());
  }

  // Checks if user is already friends with this user.
  isFriends(userId) {
    if (this.account.friends) {
      if (this.account.friends.indexOf(userId) == -1) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  // Get the status of the user in relation to the logged in user.
  getStatus(user) {
    // Returns:
    // 0 when user can be requested as friend.
    // 1 when a friend request was already sent to this user.
    // 2 when this user has a pending friend request.
    if (this.requestsSent) {
      for (var i = 0; i < this.requestsSent.length; i++) {
        if (this.requestsSent[i] == user.$key) {
          return 1;
        }
      }
    }
    if (this.friendRequests) {
      for (var j = 0; j < this.friendRequests.length; j++) {
        if (this.friendRequests[j] == user.$key) {
          return 2;
        }
      }
    }
    return 0;
  }

}
