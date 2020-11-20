import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { LoadingService } from '../services/loading.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-addmembers',
  templateUrl: './addmembers.page.html',
  styleUrls: ['./addmembers.page.scss'],
})
export class AddmembersPage implements OnInit {

  groupId: any;
  group: any;
  groupMembers: any;
  friends: any;
  searchFriend: any;
  toAdd: any;
  user: any;
  // AddMemberPage
  // This is the page where the user can add their friends to an existing group.
  // The user can only add their friends to the group.
  constructor(
    private route: ActivatedRoute,
    private dataProvider: DataService,
    private loadingProvider: LoadingService,
    private angularfire: AngularFireDatabase,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    // Initialize
    this.groupId = this.route.snapshot.params.id;

    this.searchFriend = '';
    this.toAdd = [];
    this.loadingProvider.show();

    // Get user information for system message sent to the group when a member was added.
    this.dataProvider.getCurrentUser().snapshotChanges().subscribe((user) => {
      this.user = user.payload.val();
    });

    // Get group information
    this.dataProvider.getGroup(this.groupId).snapshotChanges().subscribe((group: any) => {
      this.group = group.payload.val();
      this.groupMembers = null;
      // Get group members
      if (group.payload.val().members) {
        group.payload.val().members.forEach((memberId) => {
          this.dataProvider.getUser(memberId).snapshotChanges().subscribe((member) => {
            this.addOrUpdateMember(member);
          });
        });
        // Get user's friends to add
        this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account: any) => {

          if (account.payload.val().friends) {
            for (var i = 0; i < account.payload.val().friends.length; i++) {
              this.dataProvider.getUser(account.payload.val().friends[i]).snapshotChanges().subscribe((friendRes: any) => {
                // Only friends that are not yet a member of this group can be added.
                let friend = { $key: friendRes.key, ...friendRes.payload.val() };
                console.log(friend)
                if (!this.isMember(friend))
                  this.addOrUpdateFriend(friend);
              });
            }
            if (!this.friends) {
              this.friends = [];
            }
          } else {
            this.friends = [];
          }
        });
      }
      console.log(this.friends);
      this.loadingProvider.hide();
    });
  }

  // Check if friend is a member of the group or not.
  isMember(friend) {
    if (this.groupMembers) {
      for (var i = 0; i < this.groupMembers.length; i++) {
        if (this.groupMembers[i].$key == friend.$key) {
          return true;
        }
      }
    }
    return false;
  }

  // Check if friend is already on the list of members to be added.
  isAdded(friend) {
    if (this.toAdd) {
      for (var i = 0; i < this.toAdd.length; i++) {
        if (this.toAdd[i].$key == friend.$key) {
          return true;
        }
      }
    }
    return false;
  }

  // Toggle for adding/removing friend on the list of members to be added.
  addOrRemove(friend) {
    if (this.isAdded(friend)) {
      this.remove(friend);
    } else {
      this.add(friend);
    }
  }

  // Add or update friend information for real-time sync.
  addOrUpdateFriend(friend) {
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
  }

  // Add or update member information for real-time sync.
  addOrUpdateMember(member) {
    if (!this.groupMembers) {
      this.groupMembers = [member];
    } else {
      var index = -1;
      for (var i = 0; i < this.groupMembers.length; i++) {
        if (this.groupMembers[i].$key == member.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.groupMembers[index] = member;
      } else {
        this.groupMembers.push(member);
      }
    }
  }

  // Add friend to the list of to be added.
  add(friend) {
    this.toAdd.push(friend);
  }

  // Remove friend from the list of to be added.
  remove(friend) {
    this.toAdd.splice(this.toAdd.indexOf(friend), 1);
  }
  // Get names of the members to be added to the group.
  getNames() {
    var names = '';
    this.toAdd.forEach((friend) => {
      names += friend.name + ', ';
    });
    return names.substring(0, names.length - 2);
  }

  // Confirm adding of new members, afterwards add the members.
  done() {
    this.alertCtrl.create({
      header: 'Add Members',
      message: 'Are you sure you want to add <b>' + this.getNames() + '</b> to the group?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Add',
          handler: data => {
            // Proceed
            this.loadingProvider.show();
            this.toAdd.forEach((friend) => {
              // Add groupInfo to each friend added to the group.
              this.angularfire.object('/accounts/' + friend.$key + '/groups/' + this.groupId).update({
                messagesRead: 0
              });
              // Add friend as members of the group.
              console.log(friend.$key);
              console.log(this.group.members);
              this.group.members.push(friend.$key);
              // Add system message that the members are added to the group.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.userId,
                type: 'system',
                message: this.user.name + ' has added ' + this.getNames() + ' to the group.',
                icon: 'md-contacts'
              });
            });
            // Update group data on the database.
            this.dataProvider.getGroup(this.groupId).update({
              members: this.group.members,
              messages: this.group.messages
            }).then(() => {
              // Back.
              this.loadingProvider.hide();
            });
          }
        }
      ]
    }).then(r => r.present());
  }

}
