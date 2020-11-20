import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { LoadingService } from '../services/loading.service';
import { ModalController, AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { ImageService } from '../services/image.service';
import { Camera } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';

@Component({
  selector: 'app-groupinfo',
  templateUrl: './groupinfo.page.html',
  styleUrls: ['./groupinfo.page.scss'],
})
export class GroupinfoPage implements OnInit {

  groupId: any;
  group: any;
  groupMembers: any;
  alert: any;
  user: any;
  subscription: any;
  // GroupInfoPage
  // This is the page where the user can view group information, change group information, add members, and leave/delete group.
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataProvider: DataService,
    private loadingProvider: LoadingService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private angularfire: AngularFireDatabase,
    private imageProvider: ImageService,
    private camera: Camera
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    // Initialize

    this.groupId = this.route.snapshot.params.id;
    console.log(this.groupId);

    // Get group details.
    this.subscription = this.dataProvider.getGroup(this.groupId).snapshotChanges().subscribe((groupRes: any) => {
      let group = { $key: groupRes.key, ...groupRes.payload.val() };
      console.log(group);
      if (group != null) {
        this.loadingProvider.show();
        this.group = group;
        if (group.members) {
          group.members.forEach((memberId) => {
            this.dataProvider.getUser(memberId).snapshotChanges().subscribe((member: any) => {
              if (member.key != null) {
                member = { $key: member.key, ...member.payload.val() };
                this.addUpdateOrRemoveMember(member);
              }
            });
          });
        }
        this.loadingProvider.hide();
      } else {
        this.router.navigateByUrl('/')
      }
    });

    // Get user details.
    this.dataProvider.getCurrentUser().snapshotChanges().subscribe((user:any) => {
      this.user = { $key: user.key, ...user.payload.val() };
    });
  }

  // Delete subscription.
  // ionViewDidLeave() {
  //   if(this.deleteSubscription)
  //
  // }

  // Check if user exists in the group then add/update user.
  // If the user has already left the group, remove user from the list.
  addUpdateOrRemoveMember(member) {
    console.log(member);
    if (this.group) {
      if (this.group.members.indexOf(member.$key) > -1) {
        // User exists in the group.
        if (!this.groupMembers) {
          this.groupMembers = [member];
        } else {
          var index = -1;
          for (var i = 0; i < this.groupMembers.length; i++) {
            if (this.groupMembers[i].$key == member.$key) {
              index = i;
            }
          }
          // Add/Update User.
          if (index > -1) {
            this.groupMembers[index] = member;
          } else {
            this.groupMembers.push(member);
          }
        }
      } else {
        // User already left the group, remove member from list.
        var index1 = -1;
        for (var j = 0; j < this.groupMembers.length; j++) {
          if (this.groupMembers[j].$key == member.$key) {
            index1 = j;
          }
        }
        if (index1 > -1) {
          this.groupMembers.splice(index1, 1);
        }
      }
    }
  }

  // View user info.
  viewUser(userId) {
    if (firebase.auth().currentUser.uid != userId)
      this.router.navigateByUrl('/userinfo/' + userId);
  }

  // Enlarge group image.
  enlargeImage(img) {
    // let imageModal = this.modalCtrl.create("ImageModalPage", { img: img });
    // imageModal.present();
  }

  // Change group name.
  setName() {
    this.alert = this.alertCtrl.create({
      header: 'Change Group Name',
      message: "Please enter a new group name.",
      inputs: [
        {
          name: 'name',
          placeholder: 'Group Name',
          value: this.group.name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let name = data["name"];
            if (this.group.name != name) {
              this.loadingProvider.show();
              // Add system message.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.$key,
                type: 'system',
                message: this.user.name + ' has changed the group name to: ' + name + '.',
                icon: 'md-create'
              });
              // Update group on database.
              this.dataProvider.getGroup(this.groupId).update({
                name: name,
                messages: this.group.messages
              }).then((success) => {
                this.loadingProvider.hide();
                this.loadingProvider.showToast("Updated Succesfully");
              }).catch((error) => {
                this.loadingProvider.hide();
                this.loadingProvider.showToast("Something went wrong");
              });
            }
          }
        }
      ]
    }).then(r => r.present());
  }

  // Change group image, the user is asked if they want to take a photo or choose from gallery.
  setPhoto() {
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
            this.loadingProvider.show();
            // Upload photo and set to group photo, afterwards, return the group object as promise.
            this.imageProvider.setGroupPhotoPromise(this.group, this.camera.PictureSourceType.PHOTOLIBRARY).then((group) => {
              // Add system message.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.$key,
                type: 'system',
                message: this.user.name + ' has changed the group photo.',
                icon: 'ios-camera'
              });
              // Update group image on database.
              this.dataProvider.getGroup(this.groupId).update({
                img: group.img,
                messages: this.group.messages
              }).then((success) => {
                this.loadingProvider.hide();
                this.loadingProvider.showToast("Updated Successfully");

              }).catch((error) => {
                this.loadingProvider.hide();
                this.loadingProvider.showToast("Something went wrong");
              });
            });
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            this.loadingProvider.show();
            // Upload photo and set to group photo, afterwwards, return the group object as promise.
            this.imageProvider.setGroupPhotoPromise(this.group, this.camera.PictureSourceType.CAMERA).then((group) => {
              // Add system message.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.$key,
                type: 'system',
                message: this.user.name + ' has changed the group photo.',
                icon: 'ios-camera'
              });
              // Update group image on database.
              this.dataProvider.getGroup(this.groupId).update({
                img: group.img,
                messages: this.group.messages
              }).then((success) => {
                this.loadingProvider.hide();
                this.loadingProvider.showToast("Updated Successfully")
              }).catch((error) => {
                this.loadingProvider.hide();
                this.loadingProvider.showToast("Something went wrong")

              });
            });
          }
        }
      ]
    }).then(r => r.present());
  }

  // Change group description.
  setDescription() {
    this.alert = this.alertCtrl.create({
      header: 'Change Group Description',
      message: "Please enter a new group description.",
      inputs: [
        {
          name: 'description',
          placeholder: 'Group Description',
          value: this.group.description
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let description = data["description"];
            if (this.group.description != description) {
              this.loadingProvider.show();
              // Add system message.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.$key,
                type: 'system',
                message: this.user.name + ' has changed the group description.',
                icon: 'md-clipboard'
              });
              // Update group on database.
              this.dataProvider.getGroup(this.groupId).update({
                description: description,
                messages: this.group.messages
              }).then((success) => {
                this.loadingProvider.hide();
                this.loadingProvider.showToast("Updated Successfully")

              }).catch((error) => {
                this.loadingProvider.hide();
                this.loadingProvider.showToast("Something went wrong")
              });
            }
          }
        }
      ]
    }).then(r => r.present());
  }

  // Leave group.
  leaveGroup() {
    this.alert = this.alertCtrl.create({
      header: 'Confirm Leave',
      message: 'Are you sure you want to leave this group?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Leave',
          handler: data => {
            this.loadingProvider.show();
            // Remove member from group.
            this.group.members.splice(this.group.members.indexOf(this.user.$key), 1);
            // Add system message.
            this.group.messages.push({
              date: new Date().toString(),
              sender: this.user.$key,
              type: 'system',
              message: this.user.name + ' has left this group.',
              icon: 'md-log-out'
            });
            // Update group on database.
            this.dataProvider.getGroup(this.groupId).update({
              members: this.group.members,
              messages: this.group.messages
            }).then((success) => {
              // Remove group from user's group list.
              this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid + '/groups/' + this.groupId).remove().then(() => {
                // Pop this view because user already has left this group.
                this.group = null;
                setTimeout(() => {
                  this.loadingProvider.hide();
                  this.router.navigateByUrl('/')
                }, 300);
              });
            }).catch((error) => {
              this.loadingProvider.showToast("Something went wrong")

            });
          }
        }
      ]
    }).then(r => r.present());
  }

  // Delete group.
  deleteGroup() {
    this.alert = this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this group?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          handler: data => {
            let group = JSON.parse(JSON.stringify(this.group));
            console.log(group);
            // Delete all images of image messages.
            group.messages.forEach((message) => {
              if (message.type == 'image') {
                console.log("Delete: " + message.url + " of " + group.$key);
                this.imageProvider.deleteGroupImageFile(group.$key, message.url);
              }
            });

            this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid + '/groups/' + group.$key).remove().then(() => {
              this.dataProvider.getGroup(group.$key).remove();
            });
            // Delete group image.
            console.log("Delete: " + group.img);
            this.imageProvider.deleteImageFile(group.img);
            // this.navCtrl.popToRoot();
            this.router.navigateByUrl('/')
          }
        }
      ]
    }).then(r => r.present());
  }

  // Add members.
  addMembers() {
    this.router.navigateByUrl('/addmembers/' + this.groupId);
  }

}
