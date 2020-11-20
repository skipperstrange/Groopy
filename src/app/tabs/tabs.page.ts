import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { LoginService } from '../services/login.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  user: any = {};
  unreadMessagesCount: any;
  friendRequestCount: any;
  unreadGroupMessagesCount: any;
  groupList: any;
  groupsInfo: any;
  conversationList: any;
  conversationsInfo: any;
  // TabsPage
  // This is the page where we set our tabs.
  constructor(
    private dataProvider: DataService,
    private loginService: LoginService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
  }

  ionViewDidEnter() {
    if (localStorage.getItem('isLoggedIn') == 'true') {
      this.afAuth.auth.onAuthStateChanged(u => {
        if (u != null) {
          this.loginService.getUserData(u.uid).subscribe((user: any) => {
            this.loginService.setUser({ uid: user.key, ...user.payload.val() });
            this.user = this.loginService.getUser();
            this.fetch();
          })
        }
      })
    }
    else {
      this.router.navigateByUrl('/login');
    }
  }

  fetch() {
    // Get friend requests count.
    this.dataProvider.getRequests(this.user.uid).snapshotChanges().subscribe((requestsRes: any) => {
      let requests = requestsRes.payload.val();
      if (requests != null) {
        if (requests.friendRequests != null) this.friendRequestCount = requests.friendRequests.length;
        else this.friendRequestCount = null
      } else this.friendRequestCount = null

    });

    // Get conversations and add/update if the conversation exists, otherwise delete from list.
    this.dataProvider.getConversations().snapshotChanges().subscribe((conversationsInfoRes: any) => {
      let conversationsInfo = [];
      conversationsInfo = conversationsInfoRes.map(c => ({ $key: c.key, ...c.payload.val() }));


      this.conversationsInfo = null;
      this.conversationList = null;
      if (conversationsInfo.length > 0) {
        this.conversationsInfo = conversationsInfo;
        conversationsInfo.forEach((conversationInfo) => {
          if (conversationInfo.blocked != true) {
            this.dataProvider.getConversation(conversationInfo.conversationId).snapshotChanges().subscribe((conversationRes: any) => {
              if (conversationRes.payload.exists()) {
                let conversation: any = { $key: conversationRes.key, ...conversationRes.payload.val() };
                if (conversation.blocked != true)
                  this.addOrUpdateConversation(conversation);
              }
            });
          }
        });

      }
    });

    this.dataProvider.getGroups().snapshotChanges().subscribe((groupIdsRes: any) => {
      let groupIds = [];
      groupIds = groupIdsRes.map(c => ({ $key: c.key, ...c.payload.val() }));
      if (groupIds.length > 0) {
        this.groupsInfo = groupIds;
        if (this.groupList && this.groupList.length > groupIds.length) {
          // User left/deleted a group, clear the list and add or update each group again.
          this.groupList = null;
        }
        groupIds.forEach((groupId) => {
          this.dataProvider.getGroup(groupId.$key).snapshotChanges().subscribe((groupRes: any) => {
            let group = { $key: groupRes.key, ...groupRes.payload.val() };
            if (group.$key != null) {
              this.addOrUpdateGroup(group);
            }
          });
        });
      } else {
        this.unreadGroupMessagesCount = null;
        this.groupsInfo = null;
        this.groupList = null;
      }
    });
  }

  // Add or update conversaion for real-time sync of unreadMessagesCount.
  addOrUpdateConversation(conversation) {
    if (!this.conversationList) {
      this.conversationList = [conversation];
    } else {
      var index = -1;
      for (var i = 0; i < this.conversationList.length; i++) {
        if (this.conversationList[i].$key == conversation.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.conversationList[index] = conversation;
      } else {
        this.conversationList.push(conversation);
      }
    }
    this.computeUnreadMessagesCount();
  }

  // Compute all conversation's unreadMessages.
  computeUnreadMessagesCount() {
    this.unreadMessagesCount = 0;
    if (this.conversationList) {
      for (var i = 0; i < this.conversationList.length; i++) {
        this.unreadMessagesCount += this.conversationList[i].messages.length - this.conversationsInfo[i].messagesRead;
        if (this.unreadMessagesCount == 0) {
          this.unreadMessagesCount = null;
        }
      }
    }
  }

  getUnreadMessagesCount() {
    if (this.unreadMessagesCount) {
      if (this.unreadMessagesCount > 0) {
        return this.unreadMessagesCount;
      }
    }
    return null;
  }

  // Add or update group
  addOrUpdateGroup(group) {
    if (!this.groupList) {
      this.groupList = [group];
    } else {
      var index = -1;
      for (var i = 0; i < this.groupList.length; i++) {
        if (this.groupList[i].$key == group.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.groupList[index] = group;
      } else {
        this.groupList.push(group);
      }
    }
    this.computeUnreadGroupMessagesCount();
  }

  // Remove group from list if group is already deleted.
  removeGroup(groupId) {
    if (this.groupList) {
      var index = -1;
      for (var i = 0; i < this.groupList.length; i++) {
        if (this.groupList[i].$key == groupId) {
          index = i;
        }
      }
      if (index > -1) {
        this.groupList.splice(index, 1);
      }

      index = -1;
      for (var j = 0; j < this.groupsInfo.length; j++) {
        if (this.groupsInfo[i].$key == groupId) {
          index = j;
        }
      }
      if (index > -1) {
        this.groupsInfo.splice(index, 1);
      }
      this.computeUnreadGroupMessagesCount();
    }
  }

  // Compute all group's unreadMessages.
  computeUnreadGroupMessagesCount() {
    this.unreadGroupMessagesCount = 0;
    if (this.groupList) {
      for (var i = 0; i < this.groupList.length; i++) {
        if (this.groupList[i].messages) {
          this.unreadGroupMessagesCount += this.groupList[i].messages.length - this.groupsInfo[i].messagesRead;
        }
        if (this.unreadGroupMessagesCount == 0) {
          this.unreadGroupMessagesCount = null;
        }
      }
    }
  }

  getUnreadGroupMessagesCount() {
    if (this.unreadGroupMessagesCount) {
      if (this.unreadGroupMessagesCount > 0) {
        return this.unreadGroupMessagesCount;
      }
    }
    return null;
  }

}
