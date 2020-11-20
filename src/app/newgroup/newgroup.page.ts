import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/image.service';
import { DataService } from '../services/data.service';
import { AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingService } from '../services/loading.service';
import { Camera } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from 'src/environments/validator';

@Component({
  selector: 'app-newgroup',
  templateUrl: './newgroup.page.html',
  styleUrls: ['./newgroup.page.scss'],
})
export class NewgroupPage implements OnInit {

  group: any;
  groupForm: FormGroup;
  friends: any;
  searchFriend: any;
  groupMembers: any;
  alert: any;
  name: any;
  groupPrivacy;
  description: any;

  myForm: FormGroup;
  submitAttempt = false;
  errorMessages: any = [];

  constructor(
    private router: Router,
    private imageProvider: ImageService,
    private dataProvider: DataService,
    private alertCtrl: AlertController,
    private angularfire: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private loadingProvider: LoadingService,
    private camera: Camera,
    private formBuilder: FormBuilder
  ) {
    this.errorMessages = Validator.errorMessages
    this.myForm = this.formBuilder.group({
      groupName: Validator.groupNameValidator,
      groupDescription: Validator.groupDescriptionValidator,
    })
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    // Initialize
    this.group = {
      img: './assets/images/default-group.png'
    };
    this.searchFriend = '';

    // Get user's friends to add to the group.
    this.dataProvider.getCurrentUser().snapshotChanges().subscribe((accountRes: any) => {
      let account = { $key: accountRes.key, ...accountRes.payload.val() };
      if (!this.groupMembers) {
        this.groupMembers = [account];
      }
      if (account.friends) {
        for (var i = 0; i < account.friends.length; i++) {
          this.dataProvider.getUser(account.friends[i]).snapshotChanges().subscribe((friendRes: any) => {
            if (friendRes.key != null) {
              let friend = { $key: friendRes.key, ...friendRes.payload.val() };
              this.addOrUpdateFriend(friend);
            }
          });
        }
      } else {
        this.friends = [];
      }
    });
  }

  // Add or update friend for real-time sync.
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

  // Proceed with group creation.
  done() {
    this.submitAttempt = true;
    if (this.myForm.valid) {
      this.loadingProvider.show();
      var messages = [];
      // Add system message that group is created.
      messages.push({
        date: new Date().toString(),
        sender: this.afAuth.auth.currentUser.uid,
        type: 'system',
        message: 'This group has been created.',
        icon: 'md-chatbubbles'
      });
      // Add members of the group.
      var members = [];
      for (var i = 0; i < this.groupMembers.length; i++) {
        members.push(this.groupMembers[i].$key);
      }
      // Add group info and date.
      this.group.dateCreated = new Date().toString();
      this.group.messages = messages;
      this.group.members = members;
      this.group.name = this.name;
      //this.group.groupPrivacy = this.groupPrivacy;
      this.group.description = this.description;
      // Add group to database.
      this.angularfire.list('groups').push(this.group).then((success) => {
        let groupId = success.key;
        // Add group reference to users.
        this.angularfire.object('/accounts/' + this.groupMembers[0].$key + '/groups/' + groupId).update({
          messagesRead: 1
        });
        for (var i = 1; i < this.groupMembers.length; i++) {
          this.angularfire.object('/accounts/' + this.groupMembers[i].$key + '/groups/' + groupId).update({
            messagesRead: 0
          });
        }
        this.router.navigateByUrl('/group/' + groupId);
      });
    }
  }

  // Add friend to members of group.
  addToGroup(friend) {
    this.groupMembers.push(friend);
  }

  // Remove friend from members of group.
  removeFromGroup(friend) {
    var index = -1;
    for (var i = 1; i < this.groupMembers.length; i++) {
      if (this.groupMembers[i].$key == friend.$key) {
        index = i;
      }
    }
    if (index > -1) {
      this.groupMembers.splice(index, 1);
    }
  }

  // Check if friend is already added to the group or not.
  inGroup(friend) {
    for (var i = 0; i < this.groupMembers.length; i++) {
      if (this.groupMembers[i].$key == friend.$key) {
        return true;
      }
    }
    return false;
  }

  // Toggle to add/remove friend from the group.
  addOrRemoveFromGroup(friend) {
    if (this.inGroup(friend)) {
      this.removeFromGroup(friend);
    } else {
      this.addToGroup(friend);
    }
  }

  // Set group photo.
  setGroupPhoto() {
    this.alert = this.alertCtrl.create({
      header: 'Set Group Photo',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            this.imageProvider.setGroupPhoto(this.group, this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            this.imageProvider.setGroupPhoto(this.group, this.camera.PictureSourceType.CAMERA);
          }
        }
      ]
    }).then(r => r.present());
  }
}
